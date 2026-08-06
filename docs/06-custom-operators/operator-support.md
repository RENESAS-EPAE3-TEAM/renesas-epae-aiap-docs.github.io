# Ethos-U55 算子支持

## 资料来源与版本说明

本页依据 Arm Vela `5.1.0` tag 中的 [SUPPORTED_OPS.md](https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags) 整理。

该官方文件由 Vela 的 `--supported-ops-report` 参数自动生成，文件标记的 Vela 版本为 `5.1.0`。不同 Vela 版本的支持范围和约束可能不同，因此：

> 本页描述 Vela 5.1.0 对 Ethos-U55 的算子支持。实际部署时应使用相同版本，并以模型转换日志为最终判断依据。

## 如何理解“支持”

官方清单列出的是**可能被 Vela 放置到 Ethos-U55 NPU 的 TFLite 算子**。算子名称出现在列表中，不代表任何参数组合都能在 NPU 上执行：

- 算子必须满足通用约束。
- 带有算子专用约束的算子还必须满足对应限制。
- 未满足约束的算子会被调度到 CPU。
- 未出现在清单中的 TFLite 算子会保持不变，并由 CPU 运行时处理；还需确认所选运行时是否提供对应实现。

## Ethos-U55 和 Ethos-U65 TFLite 算子支持汇总表

Vela 5.1.0 的官方文件将 Ethos-U55 和 Ethos-U65 放在同一张 TFLite 支持表中。下表保持官方顺序和“通用约束/专用约束”形式：

| 算子 | TFLite 约束 |
| --- | --- |
| `ABS` | [通用约束](#ethos-u55-通用约束)，[专用约束][abs] |
| `ADD` | [通用约束](#ethos-u55-通用约束) |
| `ARG_MAX` | [通用约束](#ethos-u55-通用约束)，[专用约束][arg-max] |
| `AVERAGE_POOL_2D` | [通用约束](#ethos-u55-通用约束)，[专用约束][average-pool-2d] |
| `BATCH_MATMUL` | [通用约束](#ethos-u55-通用约束)，[专用约束][batch-matmul] |
| `CONCATENATION` | [通用约束](#ethos-u55-通用约束)，[专用约束][concatenation] |
| `CONV_2D` | [通用约束](#ethos-u55-通用约束)，[专用约束][conv-2d] |
| `DEPTHWISE_CONV_2D` | [通用约束](#ethos-u55-通用约束)，[专用约束][depthwise-conv-2d] |
| `EXP` | [通用约束](#ethos-u55-通用约束)，[专用约束][exp] |
| `EXPAND_DIMS` | [通用约束](#ethos-u55-通用约束) |
| `FULLY_CONNECTED` | [通用约束](#ethos-u55-通用约束)，[专用约束][fully-connected] |
| `HARD_SWISH` | [通用约束](#ethos-u55-通用约束)，[专用约束][hard-swish] |
| `LEAKY_RELU` | [通用约束](#ethos-u55-通用约束)，[专用约束][leaky-relu] |
| `LOG` | [通用约束](#ethos-u55-通用约束)，[专用约束][log] |
| `LOGISTIC` | [通用约束](#ethos-u55-通用约束)，[专用约束][logistic] |
| `MAXIMUM` | [通用约束](#ethos-u55-通用约束)，[专用约束][maximum] |
| `MAX_POOL_2D` | [通用约束](#ethos-u55-通用约束)，[专用约束][max-pool-2d] |
| `MEAN` | [通用约束](#ethos-u55-通用约束)，[专用约束][mean] |
| `MINIMUM` | [通用约束](#ethos-u55-通用约束)，[专用约束][minimum] |
| `MIRROR_PAD` | [通用约束](#ethos-u55-通用约束)，[专用约束][mirror-pad] |
| `MUL` | [通用约束](#ethos-u55-通用约束) |
| `NEG` | [通用约束](#ethos-u55-通用约束) |
| `PACK` | [通用约束](#ethos-u55-通用约束)，[专用约束][pack] |
| `PAD` | [通用约束](#ethos-u55-通用约束)，[专用约束][pad] |
| `PADV2` | [通用约束](#ethos-u55-通用约束)，[专用约束][padv2] |
| `PRELU` | [通用约束](#ethos-u55-通用约束)，[专用约束][prelu] |
| `QUANTIZE` | [通用约束](#ethos-u55-通用约束)，[专用约束][quantize] |
| `REDUCE_MAX` | [通用约束](#ethos-u55-通用约束)，[专用约束][reduce-max] |
| `REDUCE_MIN` | [通用约束](#ethos-u55-通用约束)，[专用约束][reduce-min] |
| `RELU` | [通用约束](#ethos-u55-通用约束)，[专用约束][relu] |
| `RELU6` | [通用约束](#ethos-u55-通用约束)，[专用约束][relu6] |
| `RELU_0_TO_1` | [通用约束](#ethos-u55-通用约束)，[专用约束][relu-0-to-1] |
| `RELU_N1_TO_1` | [通用约束](#ethos-u55-通用约束)，[专用约束][relu-n1-to-1] |
| `RESHAPE` | [通用约束](#ethos-u55-通用约束) |
| `RESIZE_BILINEAR` | [通用约束](#ethos-u55-通用约束)，[专用约束][resize-bilinear] |
| `RESIZE_NEAREST_NEIGHBOR` | [通用约束](#ethos-u55-通用约束)，[专用约束][resize-nearest-neighbor] |
| `REVERSE_V2` | [通用约束](#ethos-u55-通用约束)，[专用约束][reverse-v2] |
| `RSQRT` | [通用约束](#ethos-u55-通用约束)，[专用约束][rsqrt] |
| `SLICE` | [通用约束](#ethos-u55-通用约束)，[专用约束][slice] |
| `SOFTMAX` | [通用约束](#ethos-u55-通用约束)，[专用约束][softmax] |
| `SPLIT` | [通用约束](#ethos-u55-通用约束)，[专用约束][split] |
| `SPLIT_V` | [通用约束](#ethos-u55-通用约束)，[专用约束][split-v] |
| `SQUARED_DIFFERENCE` | [通用约束](#ethos-u55-通用约束)，[专用约束][squared-difference] |
| `SQUEEZE` | [通用约束](#ethos-u55-通用约束) |
| `STRIDED_SLICE` | [通用约束](#ethos-u55-通用约束)，[专用约束][strided-slice] |
| `SUB` | [通用约束](#ethos-u55-通用约束) |
| `SUM` | [通用约束](#ethos-u55-通用约束)，[专用约束][sum] |
| `TANH` | [通用约束](#ethos-u55-通用约束)，[专用约束][tanh] |
| `TILE` | [通用约束](#ethos-u55-通用约束)，[专用约束][tile] |
| `TRANSPOSE` | [通用约束](#ethos-u55-通用约束)，[专用约束][transpose] |
| `TRANSPOSE_CONV` | [通用约束](#ethos-u55-通用约束)，[专用约束][transpose-conv] |
| `UNIDIRECTIONAL_SEQUENCE_LSTM` | [通用约束](#ethos-u55-通用约束)，[专用约束][unidirectional-sequence-lstm] |
| `UNPACK` | [通用约束](#ethos-u55-通用约束)，[专用约束][unpack] |

“专用约束”链接指向 Vela 5.1.0 官方文件中对应算子的详细说明。

[abs]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-abs-constraints
[arg-max]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-arg_max-constraints
[average-pool-2d]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-average_pool_2d-constraints
[batch-matmul]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-batch_matmul-constraints
[concatenation]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-concatenation-constraints
[conv-2d]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-conv_2d-constraints
[depthwise-conv-2d]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-depthwise_conv_2d-constraints
[exp]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-exp-constraints
[fully-connected]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-fully_connected-constraints
[hard-swish]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-hard_swish-constraints
[leaky-relu]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-leaky_relu-constraints
[log]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-log-constraints
[logistic]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-logistic-constraints
[maximum]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-maximum-constraints
[max-pool-2d]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-max_pool_2d-constraints
[mean]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-mean-constraints
[minimum]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-minimum-constraints
[mirror-pad]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-mirror_pad-constraints
[pack]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-pack-constraints
[pad]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-pad-constraints
[padv2]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-padv2-constraints
[prelu]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-prelu-constraints
[quantize]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-quantize-constraints
[reduce-max]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-reduce_max-constraints
[reduce-min]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-reduce_min-constraints
[relu]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-relu-constraints
[relu6]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-relu6-constraints
[relu-0-to-1]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-relu_0_to_1-constraints
[relu-n1-to-1]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-relu_n1_to_1-constraints
[resize-bilinear]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-resize_bilinear-constraints
[resize-nearest-neighbor]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-resize_nearest_neighbor-constraints
[reverse-v2]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-reverse_v2-constraints
[rsqrt]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-rsqrt-constraints
[slice]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-slice-constraints
[softmax]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-softmax-constraints
[split]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-split-constraints
[split-v]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-split_v-constraints
[squared-difference]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-squared_difference-constraints
[strided-slice]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-strided_slice-constraints
[sum]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-sum-constraints
[tanh]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-tanh-constraints
[tile]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-tile-constraints
[transpose]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-transpose-constraints
[transpose-conv]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-transpose_conv-constraints
[unidirectional-sequence-lstm]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-unidirectional_sequence_lstm-constraints
[unpack]: https://gitlab.arm.com/artificial-intelligence/ethos-u/ethos-u-vela/-/blob/5.1.0/SUPPORTED_OPS.md?ref_type=tags#ethos-u55-and-ethos-u65-tflite-unpack-constraints

<!-- markdownlint-disable-next-line MD033 -->
<a id="ethos-u55-通用约束"></a>

## Ethos-U55 通用约束

官方文件列出的通用约束适用于大多数算子。部分算子存在例外，完整例外规则应查阅项目实际使用版本生成的报告。

- 只有张量的第一个维度可以是动态维度。
- 张量必须具有常量 shape。
- Feature map 数据类型必须属于 `INT8`、`UINT8`、`INT16`、`INT32` 或 `INT64`。
- 算子必须至少有一个输入 feature map（IFM）和一个输出 feature map（OFM）。
- 输入、输出和权重张量必须具有量化参数；部分形状、填充和量化算子除外。
- 所有量化 scale 必须为正数；部分算子除外。
- 通常不支持 per-axis quantization；`CONV_2D`、`DEPTHWISE_CONV_2D`、`FULLY_CONNECTED` 和 `TRANSPOSE_CONV` 是官方列出的例外。
- 通常不支持 64 位 feature map；`ARG_MAX` 是官方列出的例外。
- `INT32` 的 zero point 必须为 0；无符号数据类型的 zero point 必须为非负数。部分池化、缩放和 LSTM 算子存在例外。

由于通用约束包含例外条件，不能只根据本页摘要手工判断最终放置结果。

## Ethos-U55 专用约束

以下约束来自 Vela 5.1.0 的 **Ethos-U55 and Ethos-U65 Specific Operator constraints**。算子必须同时满足[通用约束](#ethos-u55-通用约束)和本节对应的专用约束，才能被调度到 NPU。

### `ABS`

- 不支持 32 位 feature map。

### `ARG_MAX`

- IFM 深度必须小于或等于 127。
- Kernel stride 必须在 `(1, 3)` 范围内。
- 运算必须沿深度轴执行。

### `AVERAGE_POOL_2D`

- 不支持 32 位 feature map。
- 当 padding 为 `VALID` 时，kernel 各维度乘积必须小于或等于 $256 \times 256$，且 kernel 高度必须小于或等于 256。
- 当 padding 不是 `VALID` 时，kernel 宽度和高度必须小于或等于 8。
- 只有在 dilation 为 1 且 padding 为 `VALID` 时，才支持大于 3 的 stride。

### `BATCH_MATMUL`

对于 MatMul 或使用动态权重的 Fully Connected：

- IFM 精度必须为 `INT8`。
- OFM 深度必须小于或等于 $2^{16}$。
- 归约轴大小必须小于或等于 $2^{16}$。

### `CONCATENATION`

- 不支持 32 位 feature map。

### `CONV_2D`

- 不支持 32 位 feature map。
- Bias 张量必须为常量。
- Bias 张量精度必须为 `INT32` 或 `INT64`。
- Bias 值必须存储在通道轴上。
- `INT64` bias 必须小于 1099511627775。
- 只有在 dilation 为 1 且 padding 为 `VALID` 时，才支持大于 3 的 stride。
- 权重张量必须为 8 位精度。
- 对于 8 位或 16 位 IFM，权重绝对值之和均不得超过 8323072。

### `DEPTHWISE_CONV_2D`

- 不支持 32 位 feature map。
- Bias 张量必须为常量。
- Bias 张量精度必须为 `INT32` 或 `INT64`。
- Bias 值必须存储在通道轴上。
- `INT64` bias 必须小于 1099511627775。
- Kernel stride 必须在 `(1, 3)` 范围内。
- 权重张量必须为 8 位精度。
- 对于 8 位或 16 位 IFM，权重绝对值之和均不得超过 8323072。

### `EXP`

- 不支持 32 位 feature map。

### `FULLY_CONNECTED`

- Bias 张量必须为常量。
- Bias 张量精度必须为 `INT32` 或 `INT64`。
- Bias 值必须存储在通道轴上。
- Fully Connected 权重必须采用 `O, 1, 1, ..., 1, I` 形式。
- 对于 MatMul 或使用动态权重的 Fully Connected，IFM 精度必须为 `INT8`。
- 对于 MatMul 或使用动态权重的 Fully Connected，OFM 深度必须小于或等于 $2^{16}$。
- 对于 MatMul 或使用动态权重的 Fully Connected，归约轴大小必须小于或等于 $2^{16}$。
- `INT64` bias 必须小于 1099511627775。
- Kernel stride 必须在 `(1, 3)` 范围内。
- 权重张量必须为 8 位精度。
- 对于 8 位或 16 位 IFM，权重绝对值之和均不得超过 8323072。

### `HARD_SWISH`

- 不支持 32 位 feature map。

### `LEAKY_RELU`

- 不支持 32 位 feature map。

### `LOG`

- 不支持 32 位 feature map。
- IFM 与 OFM 的数据类型必须相同，并且必须为 `INT8` 或 `INT16`。
- IFM 与 OFM 的 shape 必须相同。

### `LOGISTIC`

- 不支持 32 位 feature map。

### `MAXIMUM`

- 不支持 32 位 feature map。
- 两个输入的量化参数都必须与 OFM 的量化参数一致。

### `MAX_POOL_2D`

- 不支持 32 位 feature map。
- 只有在 dilation 为 1 且 padding 为 `VALID` 时，才支持大于 3 的 stride。
- Kernel 各维度乘积必须小于或等于 $256 \times 256$，且 kernel 高度必须小于或等于 256。

### `MEAN`

- 不支持 32 位 feature map。
- 归约元素数量不得超过：`INT8` 为 16777216，`UINT8` 为 8388608，`INT16` 为 65536。
- Batch 必须为 1。
- IFM 精度必须为 `INT8`、`UINT8` 或 `INT16`。
- 参数张量必须为常量。
- 归约轴大小必须小于 4096。
- 仅当 $H$、$W$、$C$ 中至少一个维度为 1 时，才支持沿深度方向归约。

### `MINIMUM`

- 不支持 32 位 feature map。
- 两个输入的量化参数都必须与 OFM 的量化参数一致。

### `MIRROR_PAD`

- 参数张量必须为常量。
- Params 张量必须为 `INT32` 或 `INT64`。

### `PACK`

- 不支持 32 位 feature map。

### `PAD`

- 不支持 32 位 feature map。
- 参数张量必须为常量。
- Params 张量必须为 `INT32` 或 `INT64`。

### `PADV2`

- 不支持 32 位 feature map。
- 参数张量必须为常量。
- Params 张量必须为 `INT32` 或 `INT64`。

### `PRELU`

- 不支持 32 位 feature map。

### `QUANTIZE`

- 不支持 32 位 feature map。

### `REDUCE_MAX`

- 不支持 32 位 feature map。
- Kernel stride 必须在 `(1, 3)` 范围内。

### `REDUCE_MIN`

- 不支持 32 位 feature map。
- Kernel stride 必须在 `(1, 3)` 范围内。

### `RELU`

- 不支持 32 位 feature map。

### `RELU6`

- 不支持 32 位 feature map。

### `RELU_0_TO_1`

- 不支持 32 位 feature map。

### `RELU_N1_TO_1`

- 不支持 32 位 feature map。

### `RESIZE_BILINEAR`

- 不支持 32 位 feature map。
- 当 IFM 不是 $H = W = 1$ 且 IFM 与 OFM shape 不同时：
  - 如果宽度与高度的 scale factor 不同，则 OFM 的宽度或高度必须为 1，并且该维度的缩放倍数也必须为 1。
  - 如果 `align_corners` 为 true，scale factor 定义为 `(OFM H - 1) / (IFM H - 1)`；否则定义为 `OFM H / IFM H`。
  - 如果 `half_pixel_centers` 为 true，scale factor 必须为 2 倍；否则必须为 2、4 或 8 倍。

### `RESIZE_NEAREST_NEIGHBOR`

- 不支持 32 位 feature map。
- 当 IFM 不是 $H = W = 1$ 且 IFM 与 OFM shape 不同时：
  - 如果宽度与高度的 scale factor 不同，则 OFM 的宽度或高度必须为 1，并且该维度的缩放倍数也必须为 1。
  - 如果 `align_corners` 为 true，scale factor 定义为 `(OFM H - 1) / (IFM H - 1)`；否则定义为 `OFM H / IFM H`。
  - Scale factor 必须为 2、4 或 8 倍。

### `REVERSE_V2`

- 不支持 32 位 feature map。
- 不支持 axis attribute。

### `RSQRT`

- 不支持 32 位 feature map。
- IFM 必须为 `INT8` 或 `INT16`。

### `SLICE`

- 不支持 32 位 feature map。
- 参数张量必须为常量。

### `SOFTMAX`

- 不支持 32 位 feature map。
- IFM 宽度与高度的乘积必须小于 65536。

### `SPLIT`

- 不支持 32 位 feature map。
- `num_splits` 必须与输出数量一致。

### `SPLIT_V`

- 不支持 32 位 feature map。
- `num_splits` 必须与输出数量一致。

### `SQUARED_DIFFERENCE`

- 不支持 32 位 feature map。

### `STRIDED_SLICE`

- 不支持 32 位 feature map。
- 参数张量必须为常量。
- Slice 必须表示一个 volume；stride 必须为非负数，并作用于 $W$ 或 $H$。

### `SUM`

- Kernel stride 必须在 `(1, 3)` 范围内。

### `TANH`

- 不支持 32 位 feature map。

### `TILE`

- 不支持 32 位 feature map。

### `TRANSPOSE`

- 当 IFM 为 `INT32` 时：
  - Rank 必须小于或等于 4。
  - `NHWC`：$C \leq 2^{16}$。
  - `NWHC`：$N = 1$、$H \leq 2^{16}$、$W \leq 2^{16}$、$C \leq 2^{14}$。
  - `NHCW`：$N \times H \leq 2^{16}$、$W \leq 2^{16}$、$C \leq 2^{16}$。
  - 不支持其他 permutation vector。
- 当 IFM 为 `INT8` 或 `INT16` 时：
  - `NHWC` 没有 shape 限制。
  - 对于 `NWHC`、`NHCW`、`NCWH`、`NWCH` 或 `NCHW` 排列，如果张量是三维张量，或者更高 rank 张量在 $H/W/C$ 以外的轴均为 1，则 $(H, W, C) \leq (2^{16}, 2^{16}, 2^{16})$。
  - 对于其他情况，rank 为 $N$ 的张量中任意 $N-2$ 个轴的维度乘积必须小于或等于 $2^{16}$。例如 rank 为 4 时，$N \times H$、$N \times W$、$N \times C$、$H \times W$、$H \times C$ 和 $W \times C$ 均不得超过 $2^{16}$。
- 参数张量必须为常量。
- 张量维数必须小于或等于 8。

### `TRANSPOSE_CONV`

- 不支持 32 位 feature map。
- Bias 张量必须为常量。
- Bias 张量精度必须为 `INT32` 或 `INT64`。
- Bias 值必须存储在通道轴上。
- `INT64` bias 必须小于 1099511627775。
- 当 padding 为 `SAME` 时，OFM 必须等于 `IFM * stride`；否则 OFM 必须等于 `IFM * stride + (kernel - stride)`。
- $W \times H$ stride 只允许 `1x1`、`2x2`、`2x1` 或 `1x2`。仅当 IFM 高度和 kernel 高度均为 1 时允许 `2x1`；仅当 IFM 宽度和 kernel 宽度均为 1 时允许 `1x2`。
- 权重张量必须为 8 位精度。
- 对于 8 位或 16 位 IFM，权重绝对值之和均不得超过 8323072。

### `UNIDIRECTIONAL_SEQUENCE_LSTM`

- 不支持 32 位 feature map。
- 不支持 gate normalization。
- 不支持 implicit gate calculation。
- 不支持 peephole variant。
- 不支持 projection。

### `UNPACK`

- 不支持 32 位 feature map。

## TFLM 支持与 NPU 支持的区别

- **TFLM 可运行**：所选 TFLM 运行时存在该算子的 CPU kernel，且工程已将其注册到 Resolver。
- **NPU 可加速**：Vela 识别该 TFLite 算子，并确认其参数满足 Ethos-U55 约束。

实现 TFLM 自定义算子不会自动让该算子在 Ethos-U55 上运行。自定义算子通常仍需要 CPU kernel；是否能够由 NPU 执行必须由 Vela 的实际转换结果确认。

## 不支持算子的处理流程

```text
Vela 将算子留在 CPU
  -> 查看 Vela 日志中的约束失败原因
    -> 能否调整参数或用受支持结构重写模型？
      是 -> 修改模型，重新量化并运行 Vela
      否 -> 确认 TFLM 是否具有 CPU kernel
        -> 已有 kernel：评估 CPU 性能
        -> 没有 kernel：评估自定义算子
```

下一步：[自定义算子部署与调试](custom-operator.md)。
