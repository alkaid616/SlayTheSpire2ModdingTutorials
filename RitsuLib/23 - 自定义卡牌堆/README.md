> 以下文章由AI编写，正在人工评阅，如有错误请提出。

`RitsuLib`提供了一套自定义卡牌堆系统，内置UI集成和本地化支持。

## 注册卡牌堆

```csharp
using STS2RitsuLib.CardPiles;

var registry = ModCardPileRegistry.For(ModId);
registry.RegisterOwned("void_pile", new ModCardPileSpec
{
    Scope = ModCardPileScope.CombatOnly,
    Style = ModCardPileUiStyle.BottomLeft,
    Anchor = ModCardPileAnchor.Default,
    IconPath: "res://Test/images/void_pile.png",
});
```

* `RegisterOwned`会生成标准格式的id：`MODID_CARDPILE_LOCALSTEM`。
* 所有注册必须在`ModelDb.Init`之前完成。

## 生命周期作用域

* `CombatOnly`：每次战斗创建，战斗结束时销毁。
* `RunPersistent`：附着于`Player`，在整个运行期间保留，跨战斗持久化。

## UI样式

* `Headless`：无UI按钮，用于不可见的持有堆。
* `TopBarDeck`：顶栏按钮，位于原版牌组按钮旁。
* `BottomLeft`：战斗UI左下按钮（靠近抽牌堆）。
* `BottomRight`：战斗UI右下按钮（靠近消耗堆）。
* `ExtraHand`：额外的手牌容器，卡牌以`NCard`节点渲染。

## 打开处理器

使用`OnOpen`回调处理堆按钮点击：

```csharp
registry.RegisterOwned("void_pile", new ModCardPileSpec
{
    Style = ModCardPileUiStyle.BottomRight,
    OnOpen = ctx =>
    {
        ctx.ShowDefaultPileScreen();        // 复用原版界面
        // 或
        ctx.OpenCapstoneScreen(myScreen);   // 挂载自定义界面
    }
});
```

* 当堆为空时，`OnOpen`回调不会被调用，会显示空堆气泡提示。

## 条件可见性

使用`VisibleWhen`动态显示或隐藏堆按钮，谓词在每个`_Process`帧求值：

```csharp
new ModCardPileSpec
{
    VisibleWhen = ctx => ctx.Player?.HasRelic("some_relic") ?? false,
}
```

## 本地化

堆的悬停提示从`static_hover_tips`本地化表中解析：

```json
{
    "MYMOD_CARDPILE_VOID.title": "虚空堆",
    "MYMOD_CARDPILE_VOID.description": "将卡牌移出战斗的区域。",
    "MYMOD_CARDPILE_VOID.empty": "虚空堆是空的。"
}
```
