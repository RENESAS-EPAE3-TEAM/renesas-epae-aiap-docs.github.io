# 模型存储介质选择

时钟与内存规划确定了 NPU、总线和可写内存条件。本页继续决定 Vela 输出模型和 Tensor Arena 的实际放置位置，为第 5 章的模型编译与工程集成提供确定的地址空间方案。

## 选择原则

模型存放位置同时影响容量、启动时间、读取带宽、布板复杂度和系统内存预算。

| 存储位置 | 适用内容 | 优点 | 注意事项 |
| --- | --- | --- |
| 片内 Flash | 小型固定模型 | 集成简单、启动方便 | 容量有限 |
| 片内 RAM | Tensor Arena、热点缓冲 | 访问快 | 空间宝贵 |
| 外部 Flash | 大模型、资源文件 | 容量大 | 初始化、读取带宽和映射方式 |
| 外部 RAM | 大型 Arena 或图像缓冲 | 容量大 | 接口时钟、对齐和稳定性 |

## MNIST 参考工程的模型放置方式

`xxd -i mnist_quant.vela.tflite array.h` 生成模型数组。根据链接段和变量属性，模型可部署到以下位置：

| 放置方式 | 示例 | 适用情况 |
| --- | --- | --- |
| 片内 Flash | `const uint8_t model[] = {...};` | 小模型，部署简单 |
| OSPI Flash | `section(".ospi0_cs1")`，16 字节对齐 | 模型超过片内 Flash 容量 |
| SDRAM | `section(".sdram_from_flash")` 或 `.sdram_from_ospi0_cs1` | 启动时复制模型，换取运行读取性能 |
| SRAM | 非 `const` 数组或 `.ram_from_ospi0_cs1` | 超小模型且需要极低延迟 |

Tensor Arena 优先放在 SRAM；当 Arena 容量超过 SRAM 时，使用 16 字节对齐的 `.sdram` 段：

```c
uint8_t tensor_arena[ARENA_SIZE]
  __attribute__((aligned(16), section(".sdram")));
```

在参考工程中，`LOCATE_MODEL_IN_OSPI` 控制模型权重是否位于 OSPI，`RUN_MODEL_FROM_SDRAM` 控制是否从 OSPI 复制到 SDRAM 运行。修改任一宏后，都要重新验证链接区域、启动时间与推理延迟。

## 决策路径

```text
模型可放入片内 Flash？
  是 -> 评估片内存储和启动时间
  否 -> 评估外部 Flash 或加载至外部 RAM
             -> 验证带宽、初始化、地址映射和功耗
```

在最终选择前，应在目标硬件上测量实际加载时间和单次推理延迟。

## 平台配置完成标准

- CPU、NPU、ICLK 和 MRICLK 时钟组合已经确定。
- Vela 配置中的时钟与存储参数能够对应目标硬件。
- 模型只读数据和 Tensor Arena 的存储区域已经确定。
- 链接段、对齐和启动复制策略已经记录。

下一步：[NPU 推理流程](../05-npu-deployment/inference-flow.md)。
