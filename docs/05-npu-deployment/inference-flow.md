# NPU 推理流程

第 4 章已经确定时钟、内存和存储方案。本章接收 `mnist_quant.tflite` 与平台配置，先使用 Vela 生成 NPU 可部署模型，再完成 TFLM 集成和板端验证。

## 部署阶段

```text
已验证的全整数 TFLite + RA8P1 Vela 配置
  -> 检查算子支持与 CPU fallback
  -> Vela 编译
  -> .vela.tflite
  -> C 数组与链接段
  -> TFLM 工程
```

Vela 编译必须使用与目标工程一致的 NPU 时钟、存储区域和 memory mode。普通量化 `.tflite` 是 Vela 的输入，`.vela.tflite` 才是后续 NPU 模型集成的输入。

## 算子兼容性决策

Vela 编译和 TFLM 初始化之间存在一个算子兼容性检查点。先查看 Vela 日志确认各算子的执行后端，再确认 CPU fallback 算子是否具有可注册的 TFLM kernel：

```text
Vela 编译量化 TFLite
  -> 所有目标算子均满足 Ethos-U55 约束？
    是 -> 继续生成 .vela.tflite 并集成模型
    否 -> 查看 CPU fallback 原因
      -> 能调整参数或重写为受支持结构？
        是 -> 回到模型转换、量化与验证，重新运行 Vela
        否 -> TFLM 已有并可注册 CPU kernel？
          是 -> 注册 kernel，评估 CPU 性能后继续集成
          否 -> 进入自定义算子部署与调试
```

具体支持范围和参数限制参见[Ethos-U55 算子支持检查](../07-custom-operators/operator-support.md)。只有在模型无法合理重写且运行时没有可用 kernel 时，才进入[自定义算子部署与调试](../07-custom-operators/custom-operator.md)。自定义算子通常在 Cortex-M85 CPU 上执行，不会自动获得 Ethos-U55 加速。

## 初始化阶段

1. 初始化板级驱动、时钟和模型存储接口。
2. 取得模型数据，创建 TFLM 模型与解释器。
3. 注册模型需要的算子，并初始化 NPU 相关后端。
4. 分配 Tensor Arena，获取输入输出张量。
5. 校验张量形状、类型与量化参数。

## 单次推理阶段

```text
采集输入 -> 前处理 -> 写入输入 Tensor -> Invoke
  -> 读取输出 Tensor -> 反量化与后处理 -> 上报结果
```

输入写入前必须与模型期望的数据布局、类型、scale 和 zero point 一致。`Invoke` 成功仅表明运行时调用完成，仍需用参考样本验证结果。

## 验证阶段

| 维度 | 验证内容 |
| --- | --- |
| 功能 | 程序稳定运行并输出结果 |
| 精度 | 与 PC 侧 INT8 参考结果接近 |
| 后端 | 确认预期算子实际使用 NPU 或记录 CPU fallback |
| 性能 | 延迟、吞吐和峰值内存达到项目目标 |

下一步：[模型集成](model-integration.md)。
