# 运行第一个 AI 示例 - MNIST

## 目标

使用 `mnist_quant.tflite` 在 EK-RA8P1 上完成 Vela 转换、模型数组生成、编译烧录和 0 到 9 的推理验证。

本章使用已量化模型快速走通部署主线：

```text
mnist_quant.tflite -> Vela -> mnist_quant.vela.tflite
  -> C 数组 -> RA8P1 工程 -> 编译烧录 -> RTT 验证
```

完成本章后，再进入第 3 章学习如何从 Keras 模型直接生成全整数 TFLite，或将 ONNX 模型经 onnx2tf 转换后量化。

## 1. 选择时钟配置

在工程 Clock 页面设置 CPU0、NPU、ICLK 与 MRICLK，并在 `inference.cpp` 中选择相同的 `MODEL_SETTING`。详细组合和 Vela 时钟比例参见[时钟、Vela 与内存规划](../04-platform-configuration/clock-and-memory.md)。

## 2. 使用 Vela 转换模型

进入与所选时钟配置对应的目录，确认 `ra8p1_vela.ini` 的 `core_clock`、`Sram_clock_scale` 和 `OffChipFlash_clock_scale` 已同步后运行：

Vela 命令参数参见 [Vela 5.1.0 OPTIONS.md](https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/OPTIONS.md?ref_type=tags)。在 DOS（Windows）或 Shell（Linux）环境中运行：

```bash
vela ../model/mnist_quant.tflite \
  --config ra8p1_vela.ini \
  --system-config RA8P1 \
  --memory-mode Sram_Only \
  --optimise Performance \
  --output-dir output_0 \
  > dbg0.log
```

预期输出：

- `dbg0.log`：Vela 转换日志；
- `output_0/mnist_quant.vela.tflite`：部署模型；
- `output_0/mnist_quant_summary_RA8P1.csv`：Vela 汇总数据。

## 3. 生成固件模型数组

将转换后的模型转为 C 头文件：

```bash
xxd -i output_0/mnist_quant.vela.tflite array.h
```

将生成的 `array.h` 放入当前时钟配置对应的 `output_0` 目录。确认 `inference.cpp` 的 `#include` 路径与 `MODEL_SETTING` 一致。

## 4. 选择模型与 Arena 存储

小型 MNIST 模型可直接放片内 Flash。若使用 OSPI、SDRAM 或 SRAM，请按[模型存储介质选择](../04-platform-configuration/storage-selection.md)设置 section、对齐和启动复制策略。Tensor Arena 必须放在可写 RAM。

## 5. 编译、烧录并观察 RTT

使用 e2 studio 构建并烧录工程，然后通过 SEGGER RTT Viewer 观察输出。以数字 9 的测试数据为例，预期日志如下：

```text
mnist output:
0 0 0 0 0 0 0 0 0 -1
Status of executed job:
Success
```

输出张量为 INT8，shape 为 `[1, 10]`。`-1` 所在索引是预测类别，`0` 表示非预测类别。上例的索引 9 为识别结果。

## 6. 验证全部样本

工程提供 `input_mnist_0.h` 至 `input_mnist_9.h`。在 `inference.cpp` 中切换包含的输入文件，逐一运行 0 到 9 的样本，并记录预测类别、时钟配置、模型位置与推理时间。

## 完成标准

- Vela 配置与实际 CPU/NPU/ICLK/MRICLK 配置一致。
- 模型加载、Tensor Arena 分配和 Ethos-U55 任务均返回成功。
- RTT 显示 `Success`，且每个 MNIST 输入的预测索引符合样本标签。
- 已记录模型所在介质与相应的性能数据。

下一步：[模型转换、全整数量化与精度验证](../03-model-preparation/int8-quantization.md)。
