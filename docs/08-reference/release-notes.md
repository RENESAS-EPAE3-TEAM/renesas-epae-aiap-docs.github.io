# 发行说明

## v1.0.0 - 2026-08-06

### 主要内容

1. RA8P1 AI 概述：平台与软件架构、完整开发流程。
2. 快速入门：开发环境准备、MNIST 示例。
3. 模型转换与量化：Keras/ONNX 模型转换、INT8 量化、接口与 PC 精度验证。
4. 平台配置：时钟、Vela、内存与模型存储介质规划。
5. NPU 模型部署：RA8P1 上电、NPU 初始化、TFLM `MicroInterpreter` 与 `Invoke()` 推理调用链。
6. 自定义算子：Ethos-U55 算子支持、CPU fallback 判断，以及 `RFFT2D -> COMPLEX_ABS -> MyScale` 的实现和调试案例。
7. 性能调优：NPU 后端、时钟、内存位置与数据搬运的排查顺序。
8. 参考资料：源文档维护说明和本发行说明。




