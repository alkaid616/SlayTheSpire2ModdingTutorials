> 以下文章由AI编写，正在人工评阅，如有错误请提出。

`RitsuLib`提供了一套自定义顶栏按钮注册系统，支持图标、点击处理、可见性控制和计数徽章。

## 注册按钮

```csharp
using STS2RitsuLib.TopBar;

var registry = ModTopBarButtonRegistry.For(ModId);
registry.RegisterOwned("recipes", new ModTopBarButtonSpec
{
    IconPath = "res://Test/images/recipe_icon.png",
    Order = 0,
    OnClick = ctx => ctx.ToggleCapstoneScreen(new MyRecipeScreen()),
    VisibleWhen = ctx => ctx.Player != null,
    IsOpenWhen = ctx => ModScreenService.CurrentCapstoneScreen is MyRecipeScreen,
    CountProvider = ctx => RecipeManager.UnlockedCount,
});
```

* `OnClick`是必需的。
* `VisibleWhen`、`IsOpenWhen`和`CountProvider`是可选的。

## Spec属性

* `IconPath`：按钮图标的Godot资源路径。
* `Order`：排序顺序，越小越靠近原版牌组按钮。
* `Offset`：额外像素偏移。
* `VisibleWhen`：可见性谓词，每帧求值。
* `IsOpenWhen`：界面打开谓词，用于摇摆状态。
* `CountProvider`：计数徽章提供器。

## 上下文对象

所有回调接收一个`ModTopBarButtonContext`：

* `Definition` — 注册器定义。
* `Player` — 本地玩家（运行间隙为null）。
* `OpenCapstoneScreen(screen)` — 打开界面。
* `ToggleCapstoneScreen(screen)` — 切换界面。
* `CloseCapstoneScreen()` — 关闭当前界面。

## 本地化

悬停提示从`static_hover_tips`本地化表中解析：

```json
{
    "MYMOD_TOPBARBUTTON_RECIPES.title": "配方",
    "MYMOD_TOPBARBUTTON_RECIPES.description": "查看已解锁的配方。"
}
```

## 自动注册

实现`IModTopBarButtonHandler`并使用属性：

```csharp
[RegisterOwnedTopBarButtonAttribute("recipes", IconPath = "res://icon.png")]
public class RecipeButton : IModTopBarButtonHandler
{
    public void OnClick(ModTopBarButtonContext ctx)
    {
        ctx.ToggleCapstoneScreen(new MyRecipeScreen());
    }

    public int GetCount(ModTopBarButtonContext ctx)
        => RecipeManager.UnlockedCount;
}
```
