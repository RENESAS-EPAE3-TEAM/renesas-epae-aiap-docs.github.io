# 模型转换、全整数量化与精度验证

## 本章目标

第 2 章使用现成的 `mnist_quant.tflite` 完成了板端部署。本章回到模型侧，说明如何从 Keras 或 ONNX 浮点模型生成全整数 TFLite，并在进入 RA8P1 平台配置前完成 PC 侧精度和接口检查。

两条模型输入路径最终汇合到同一验证流程：

```text
Keras 模型 -----------------------> TFLite Converter --+
                                                        |
ONNX -> onnx2tf -> SavedModel/FP32 TFLite ------------+
                                                        v
                 Representative Dataset -> 全整数量化 TFLite
                                                        |
                                                        v
                                   接口检查 -> PC 精度验证
```

本章输入和输出如下：

| 阶段 | 产物 |
| --- | --- |
| 输入 | 已完成浮点基线验证的 Keras 或 ONNX 模型 |
| 中间产物 | ONNX 路径生成的 SavedModel 和 FP32 TFLite |
| 输出 | 已验证的全整数 TFLite、接口参数和精度记录 |

## 1. 转换前固定模型接口

无论采用哪条路径，都应先保存一组固定的基准输入和浮点输出，并记录：

| 项目 | 需要确认的内容 |
| --- | --- |
| 输入 | 名称、shape、布局、数据类型和数值范围 |
| 输出 | 名称、shape 和结果含义 |
| 前处理 | 尺寸调整、通道顺序、归一化和量化规则 |
| 后处理 | 反量化、阈值和标签映射 |
| 工具 | Python、TensorFlow、ONNX 和 onnx2tf 版本 |

优先固定模型输入维度。动态 shape、隐式布局转换或前处理差异会使“文件转换成功”与“推理结果正确”成为两件不同的事。

## 2. 配置全整数量化

使用以下配置执行全整数量化：

```python
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.representative_dataset = representative_dataset
converter.target_spec.supported_ops = [
    tf.lite.OpsSet.TFLITE_BUILTINS_INT8
]
```

其中 Representative Dataset 用于确定量化范围。传给转换器的样本应为 `float32`，并采用与模型训练和实际推理一致的尺寸、布局和预处理方式。

## 3. 明确量化模型接口类型

整数算子模型的输入输出接口可以配置为 `int8` 或 `uint8`。接口类型会直接影响 PC 测试数据和 RA8P1 固件中的张量读写方式。

### INT8 输入输出接口

如果应用要求有符号接口，可使用以下配置：

```python
converter.inference_input_type = tf.int8
converter.inference_output_type = tf.int8
```

### UINT8 输入输出接口

提供的 `mnist-tf.py` 使用以下配置：

```python
converter.inference_input_type = tf.uint8
converter.inference_output_type = tf.uint8
```

因此，该 MNIST 脚本生成的是**整数算子模型，输入输出接口为 UINT8**。文档、测试数据和固件不能仅根据文件名 `mnist_quant.tflite` 推断接口类型。部署前必须读取模型 metadata 确认实际类型。

## 4. 路径 A：从 Keras MNIST 生成量化 TFLite

### 4.1 数据预处理

`mnist-tf.py` 将 MNIST 图像转换为 `float32`，归一化到 $[0,1]$，并增加通道维度：

```python
def prepare_data():
    (x_train, y_train), (x_test, y_test) = \
        tf.keras.datasets.mnist.load_data()
    x_train = np.expand_dims(x_train.astype("float32") / 255.0, -1)
    x_test = np.expand_dims(x_test.astype("float32") / 255.0, -1)
    return (x_train, y_train), (x_test, y_test)
```

模型输入 shape 为 `(28, 28, 1)`。设备侧输入必须采用与这里一致的图像尺寸、通道顺序和数值映射。

### 4.2 Representative Dataset

参考脚本使用训练集前 100 个样本进行校准：

```python
def representative_dataset():
    for i in range(100):
        yield [x_train[i:i + 1]]
```

该写法可以完成转换。对于实际项目，应确认这些样本能够代表目标场景中的输入分布；不能用随机噪声得到的转换成功结果替代真实数据精度验证。

### 4.3 转换并保存模型

MNIST 参考脚本的量化代码如下：

```python
def quantize_and_export_tflite(model, x_train):
    def representative_dataset():
        for i in range(100):
            yield [x_train[i:i + 1]]

    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    converter.optimizations = [tf.lite.Optimize.DEFAULT]
    converter.representative_dataset = representative_dataset
    converter.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS_INT8
    ]
    converter.inference_input_type = tf.uint8
    converter.inference_output_type = tf.uint8

    tflite_model = converter.convert()
    with open("mnist_quant.tflite", "wb") as file:
        file.write(tflite_model)
```

本步骤的输出是：

```text
mnist_quant.tflite
```

它是 Vela 的输入模型，还不是最终编入 Ethos-U55 固件的 Vela 模型数组。

## 5. 路径 B：ONNX 经 onnx2tf 转换并量化

Vela 不直接接收 ONNX 模型。对于已有 ONNX 模型，先使用 [onnx2tf](https://github.com/PINTO0309/onnx2tf) 生成 TensorFlow SavedModel 和 FP32 TFLite，再从 SavedModel 执行全整数量化。

```text
model.onnx
    -> onnx2tf
    -> SavedModel + FP32 TFLite
    -> TFLite Converter + Representative Dataset
    -> model_int8.tflite
```

### 5.1 准备环境

参考工程验证过的基础组合包括 Python 3.10.5、TensorFlow 2.18.0 和 ONNX 1.17.0。`onnx2tf` 还需要与 TensorFlow 匹配的 `tf-keras`。实际安装时应固定并记录完整依赖版本，不要在同一次模型验证中更换转换工具版本。

先确认命令来自预期的 Python 环境：

```bash
python --version
onnx2tf --help
```

### 5.2 检查 ONNX 基线

转换前至少完成以下检查：

- ONNX 模型可由 ONNX Runtime 加载并运行固定参考输入。
- 输入 shape 已固定，并记录原始布局，例如 `NCHW`。
- 已保存浮点输出，供后续 SavedModel、FP32 TFLite 和量化 TFLite 比较。
- 已识别可能不受 TFLite、TFLM 或 Ethos-U55 支持的算子。

### 5.3 使用 onnx2tf 转换

以下命令将 ONNX 模型转换到 `output_folder`，并输出可供 TensorFlow Lite Converter 使用的 SavedModel：

```bash
onnx2tf \
    -i model.onnx \
    -o output_folder \
    --output_signaturedefs
```

转换完成后，不要只确认目录已经生成。应检查转换日志和输出文件，并使用固定参考输入验证 FP32 TFLite。

onnx2tf 可能将 ONNX 的 `NCHW` 输入转换为 TensorFlow/TFLite 常用的 `NHWC` 布局。例如参考模型的输入由 ONNX `[1, 5, 1, 1024]` 变为 TFLite `[1, 1, 1024, 5]`。这不是可以忽略的 shape 变化；设备侧前处理和测试脚本必须按转换后的实际接口准备数据。

### 5.4 从 SavedModel 执行全整数量化

Representative Dataset 必须产生与**转换后 SavedModel 输入接口**一致的 `float32` 样本。以下示例使用 INT8 输入输出接口：

```python
import tensorflow as tf


def representative_dataset():
        for sample in calibration_samples:
                yield [sample.astype("float32")]


converter = tf.lite.TFLiteConverter.from_saved_model("output_folder")
converter.optimizations = [tf.lite.Optimize.DEFAULT]
converter.representative_dataset = representative_dataset
converter.target_spec.supported_ops = [
        tf.lite.OpsSet.TFLITE_BUILTINS_INT8
]
converter.inference_input_type = tf.int8
converter.inference_output_type = tf.int8

quantized_model = converter.convert()
with open("model_int8.tflite", "wb") as file:
        file.write(quantized_model)
```

如果模型有多个输入，Representative Dataset 每次 `yield` 的张量数量、顺序、shape 和 dtype 都必须与 SavedModel signature 一致。随机数据只能用于检查转换流程，不能用于判断最终量化精度。

## 6. 检查输入输出与量化参数

转换完成后，使用 TFLite Interpreter 读取模型接口：

```python
model_path = "mnist_quant.tflite"  # 或 ONNX 路径生成的 model_int8.tflite
interpreter = tf.lite.Interpreter(model_path=model_path)
interpreter.allocate_tensors()

input_details = interpreter.get_input_details()[0]
output_details = interpreter.get_output_details()[0]

print("input shape:", input_details["shape"])
print("input dtype:", input_details["dtype"])
print("input quantization:", input_details["quantization"])
print("output shape:", output_details["shape"])
print("output dtype:", output_details["dtype"])
print("output quantization:", output_details["quantization"])
```

至少记录以下信息：

| 项目 | 记录内容 |
| --- | --- |
| 输入 | shape、dtype、scale、zero point |
| 输出 | shape、dtype、scale、zero point |
| 文件 | 文件名和模型大小 |
| 工具 | TensorFlow、转换工具和 Python 版本 |

若 Interpreter 返回的 dtype 与预期不一致，应先检查转换器的 `inference_input_type` 和 `inference_output_type`，不要直接修改设备侧指针类型来掩盖问题。

对于 ONNX 路径，还应将这里读取的 TFLite shape 与原始 ONNX 接口记录并列保存，明确布局是否发生变化。

## 7. PC 侧推理验证

`mnist-tf.py` 使用量化模型随机显示若干测试样本的预测结果。对于 UINT8 接口，参考脚本先将归一化输入恢复到 $[0,255]$ 并转换为 `np.uint8`：

```python
sample_input = (
    tf.image.resize(sample, [28, 28]).numpy() * 255
).astype(np.uint8)[None, ...]

interpreter.set_tensor(input_details["index"], sample_input)
interpreter.invoke()
output = interpreter.get_tensor(output_details["index"])[0]
prediction = np.argmax(output)
```

随机显示少量样本只能用于功能检查，不能作为量化精度结论。发布模型前应使用固定测试集分别评估浮点模型和量化模型，并记录实际测得的精度；本指南不预设未经测试的准确率。

ONNX 路径应至少比较三个阶段：

```text
ONNX 浮点基线 <-> FP32 TFLite <-> 全整数量化 TFLite
```

如果 FP32 TFLite 已明显偏离 ONNX 基线，问题位于模型转换或布局处理，不应通过调整量化参数掩盖。只有 FP32 转换基线通过后，才评估量化造成的精度变化。

## 8. 建议测试记录

| 模型 | 大小 | 实测精度 | 输入类型 | 输出类型 |
| --- | ---: | ---: | --- | --- |
| 原始 Keras 或 ONNX | 待填写 | 待填写 | FP32 | FP32 |
| FP32 TFLite | 待填写 | 待填写 | FP32 | FP32 |
| 量化 TFLite | 待填写 | 待填写 | INT8 或 UINT8 | INT8 或 UINT8 |

精度比较必须使用相同的测试数据和等价的前处理、后处理。

对于 ONNX 模型，另行记录 ONNX 输入布局、转换后 TFLite 输入布局，以及两者之间的数据重排规则。

## 9. 交付给平台配置的产物

进入第 4 章前，应准备以下内容：

- 已通过 PC 侧固定测试集验证的全整数 TFLite，例如 `mnist_quant.tflite` 或 `model_int8.tflite`。
- 输入和输出的 shape、dtype、scale 与 zero point。
- 原始浮点模型、FP32 TFLite 和量化 TFLite 的实测精度记录。
- 模型文件大小，以及 Representative Dataset 的来源和预处理说明。
- ONNX 路径的输入布局变化和数据重排规则。

第 4 章将根据模型大小、Tensor Arena 和目标性能规划时钟、内存和存储。完成平台配置后，Ethos-U55 部署仍需经过 Vela：

```text
mnist_quant.tflite
  -> Vela
  -> mnist_quant.vela.tflite
  -> C 数组头文件
  -> RA8P1 工程
```

不要将普通 `mnist_quant.tflite` 直接生成的模型头文件，与 Vela 输出模型生成的头文件混为一谈。

## 常见问题

- Representative Dataset 的预处理与实际输入不一致。
- ONNX 的 `NCHW` 输入直接写入转换后的 `NHWC` TFLite 模型。
- 只确认 onnx2tf 生成文件，没有比较 ONNX 与 FP32 TFLite 输出。
- 未固定 onnx2tf、TensorFlow、tf-keras 和 ONNX 的版本。
- 仅确认转换成功，没有比较量化前后的实测精度。
- 将 UINT8 接口模型按 `int8_t` 读取，或将 INT8 接口模型按 `uint8_t` 读取。
- 未记录输入输出的 scale 和 zero point。
- 将普通量化 TFLite 模型数组直接用于预期由 Ethos-U55 执行的工程，而未经过 Vela。

下一步：[时钟、Vela 与内存规划](../04-platform-configuration/clock-and-memory.md)。
