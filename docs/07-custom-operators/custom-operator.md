# 自定义算子部署与调试

## 参考模型：RFFT2D -> COMPLEX_ABS -> MyScale

本文使用 EK-RA8P1 上的 `RFFT2D -> COMPLEX_ABS -> MyScale` 模型说明完整调试闭环。输入为 `float32 [1,16,32]`，RFFT2D 输出为 `complex64 [1,16,17]`，最终输出为 `float32 [1,16,17]`。当前参考模型的三个节点都由 CPU 执行；Vela 结果为 3 个 CPU operators、0 个 NPU operators。

`MyScale` 的参数为 `scale=3.0`、`bias=1.0`，参考结果为：

$$final = |RFFT2D(input)| \times 3.0 + 1.0$$

## 适用条件

仅当模型结构不能合理替换、且 CPU 实现的性能和内存成本可以接受时，再引入自定义算子。

## 实现要点

- 在 `Init` 中保存长期需要的上下文。
- 在 `Prepare` 中验证 Tensor 类型、维度、量化参数并规划临时内存。
- 在 `Eval` 中执行计算，严格处理边界、对齐和量化。
- 将算子注册到工程实际使用的 resolver。

对于本参考模型，`RFFT2D` 与 `COMPLEX_ABS` 是 builtin 节点，按 builtin opcode 注册；只有 `MyScale` 是 CUSTOM 节点，必须使用模型内完全一致的字符串注册：

```cpp
AddBuiltin(BuiltinOperator_RFFT2D, Register_RFFT2D(), ParseNoBuiltinOptions);
AddBuiltin(BuiltinOperator_COMPLEX_ABS, Register_COMPLEX_ABS(), ParseNoBuiltinOptions);
AddCustom("MyScale", Register_MY_SCALE());
```

不能将 builtin 节点以 `AddCustom()` 注册，也不能以输出 tensor 名 `myscale_output` 替代 `MyScale`。

## 调试步骤

1. 先在 PC 侧针对固定输入创建单元测试。
2. 在设备侧打印输入输出形状、类型和关键量化参数。
3. 先验证单个算子输出，再验证整张模型。
4. 遇到 HardFault 时检查 Arena、栈、张量索引和指针边界。
5. 记录该算子是 CPU fallback 还是可被 NPU 后端处理。

## 分阶段验收

1. 在 Python 侧生成 `model_rfft2d_myscale.tflite`、输入和参考输出，并确认 CUSTOM code 为 `MyScale`。
2. 检查 Resolver 的 `RFFT2D`、`COMPLEX_ABS`、`MyScale` 和 Ethos-U 注册均成功。
3. 确认三个 `Prepare` 成功；MyScale 输出应为 272 个 `float32` 元素，即 1088 字节。
4. 确认 `AllocateTensors()`、输入复制和 `Invoke()` 成功。
5. 将板端最终输出与 `test_output_ref` 比较，记录最大绝对误差。

`RFFT2D` 可在 `Eval()` 中使用 CMSIS-DSP 优化路径；这仍在 Cortex-M85 CPU 上执行，并不代表节点已经由 Ethos-U55 加速。