> 以下文章由AI编写，正在人工评阅，如有错误请提出。

`RitsuLib`提供了一套通知提示服务，用于向玩家显示非侵入式消息。

## 快速开始

```csharp
using STS2RitsuLib.Ui.Toast;

RitsuToastService.ShowInfo("卡牌已加入牌组！");
RitsuToastService.ShowWarning("生命值过低！", "警告");
RitsuToastService.ShowError("保存失败。", onClick: () => RetrySave());
```

## 完整请求

如需完全控制，构造`RitsuToastRequest`：

```csharp
RitsuToastService.Show(new RitsuToastRequest(
    body: "新配方已解锁！",
    title: "配方",
    image: myTexture,
    level: RitsuToastLevel.Info,
    durationSeconds: 5.0,
    onClick: () => OpenRecipeScreen(),
    animationOverride: RitsuToastAnimationPreset.FadeScale
));
```

## 请求属性

* `Body`：正文文本（必需）。
* `Title`：可选的标题。
* `Image`：可选的前置图片。
* `Level`：通知级别，`Info`、`Warning`、`Error`，每个级别有不同的默认样式。
* `DurationSeconds`：持续时间（null=全局默认3.5秒）。
* `OnClick`：可选的点击回调。
* `AnimationOverride`：动画覆盖。

## 动画预设

* `Fade`：仅淡入淡出。
* `FadeSlide`：淡入淡出+方向滑动（默认）。
* `FadeScale`：淡入淡出+缩放。

## 静态工厂方法

```csharp
var req = RitsuToastRequest.Info("正文", "标题");
var req = RitsuToastRequest.Warning("正文");
var req = RitsuToastRequest.Error("正文", "标题");
```
