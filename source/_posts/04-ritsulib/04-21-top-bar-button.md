---
title: 顶栏按钮
date: 2026-05-16 22:12:31
permalink: docs/04-ritsulib/04-21-top-bar-button/
author: Reme、alkaid616
categories:
- Basics
---
> 以下文章由AI编写，正在人工评阅，如有错误请提出。

`RitsuLib`提供了一套自定义顶栏按钮注册系统，支持图标、点击处理、可见性控制和计数徽章。

## 注册按钮

在 `Entry.Init` 中注册：

```csharp
using MegaCrit.Sts2.Core.Logging;
using MegaCrit.Sts2.Core.Modding;
using STS2RitsuLib;
using STS2RitsuLib.TopBar;
using STS2RitsuLib.Ui.Toast;

namespace Test.Scripts;

[ModInitializer(nameof(Init))]
public class Entry
{
    public const string ModId = "test";
    public static readonly Logger Logger = RitsuLibFramework.CreateLogger(ModId);

    public static void Init()
    {
        var registry = ModTopBarButtonRegistry.For(ModId);
        registry.RegisterOwned("recipes", new ModTopBarButtonSpec
        {
            IconPath = "res://Test/images/recipe_icon.png",
            Order = 0,
            OnClick = ctx => RitsuToastService.ShowInfo("配方按钮已点击"),
            VisibleWhen = ctx => ctx.Player != null,
        });
    }
}
```

若需要「界面已打开」的摇摆状态，可配合 `ModScreenService`（`STS2RitsuLib.Screens`）：

```csharp
using STS2RitsuLib.Screens;

// ...
IsOpenWhen = ctx => ModScreenService.CurrentCapstoneScreen is MyRecipeScreen,
CountProvider = ctx => RecipeManager.UnlockedCount,
```

* `OnClick` 是必需的。
* `VisibleWhen`、`IsOpenWhen` 和 `CountProvider` 是可选的。

## Spec属性

* `IconPath`：按钮图标的 Godot 资源路径。
* `Order`：排序顺序，越小越靠近原版牌组按钮。
* `Offset`：额外像素偏移。
* `VisibleWhen`：可见性谓词，每帧求值。
* `IsOpenWhen`：界面打开谓词，用于摇摆状态。
* `CountProvider`：计数徽章提供器。

## 上下文对象

所有回调接收一个 `ModTopBarButtonContext`：

* `Definition` — 注册器定义。
* `Player` — 本地玩家（运行间隙为 null）。
* `OpenCapstoneScreen(screen)` — 打开界面。
* `ToggleCapstoneScreen(screen)` — 切换界面。
* `CloseCapstoneScreen()` — 关闭当前界面。

## 本地化

悬停提示从 `static_hover_tips` 本地化表中解析。若 mod id 为 `test`、local stem 为 `recipes`，则 qualified id 为 `TEST_TOPBARBUTTON_RECIPES`：

```json
{
    "TEST_TOPBARBUTTON_RECIPES.title": "配方",
    "TEST_TOPBARBUTTON_RECIPES.description": "查看已解锁的配方。"
}
```

## 自动注册

实现 `IModTopBarButtonHandler` 并使用属性（需已调用 `ModTypeDiscoveryHub.RegisterModAssembly`）：

```csharp
using STS2RitsuLib.Interop.AutoRegistration;
using STS2RitsuLib.Screens;
using STS2RitsuLib.TopBar;
using STS2RitsuLib.Ui.Toast;

namespace Test.Scripts;

[RegisterOwnedTopBarButton("recipes", IconPath = "res://Test/images/recipe_icon.png")]
public sealed class RecipeButtonHandler : IModTopBarButtonHandler
{
    public void OnClick(ModTopBarButtonContext ctx)
    {
        RitsuToastService.ShowInfo("配方按钮已点击");
    }

    public bool IsVisible(ModTopBarButtonContext ctx) => ctx.Player != null;

    public int GetCount(ModTopBarButtonContext ctx) => 3;
}
```

* 特性类名为 `RegisterOwnedTopBarButtonAttribute`，可写 `[RegisterOwnedTopBarButton(...)]`。
* `GetCount` 默认返回 `-1` 表示不显示徽章；覆盖后才会显示数字。
