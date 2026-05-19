---
title: 数据保存
date: 2026-05-04 13:57:41
permalink: docs/04-ritsulib/04-17-data-save/
categories:
- Basics
---
## 局内保存（SavedAttachedState）

如果你想给卡牌、遗物等对象添加一个会随存档保存的状态，可以使用`SavedAttachedState<TOwner, TValue>`。

下面以遗物为例：每回合开始时记录经过的回合数，并把这个数值显示在遗物描述里的`{GameTurns}`中。

```csharp
using Godot;
using MegaCrit.Sts2.Core.Commands;
using MegaCrit.Sts2.Core.Entities.Cards;
using MegaCrit.Sts2.Core.Entities.Players;
using MegaCrit.Sts2.Core.Entities.Relics;
using MegaCrit.Sts2.Core.GameActions.Multiplayer;
using MegaCrit.Sts2.Core.Localization.DynamicVars;
using MegaCrit.Sts2.Core.Models.RelicPools;
using STS2RitsuLib.Interop.AutoRegistration;
using STS2RitsuLib.Scaffolding.Content;
using STS2RitsuLib.Utils;

namespace Test.Scripts;

[RegisterRelic(typeof(SharedRelicPool))]
// [RegisterCharacterStarterRelic(typeof(TestCharacter))]
public class TestRelic : ModRelicTemplate
{
    // 加上这行
    public static readonly SavedAttachedState<TestRelic, int> GameTurns = new("GameTurns", _ => 0);

    public override RelicRarity Rarity => RelicRarity.Common;

    protected override IEnumerable<DynamicVar> CanonicalVars => [
        new CardsVar(1),
        new DynamicVar("GameTurns", GameTurns[this])
    ];

    public override RelicAssetProfile AssetProfile => new(
        IconPath: $"res://Test/images/relics/{Id.Entry.ToLowerInvariant()}.png",
        IconOutlinePath: $"res://Test/images/relics/{Id.Entry.ToLowerInvariant()}.png",
        BigIconPath: $"res://Test/images/relics/{Id.Entry.ToLowerInvariant()}.png"
    );

    public override async Task AfterPlayerTurnStart(PlayerChoiceContext choiceContext, Player player)
    {
        // 每回合开始时，修改GameTurns的值，并改变遗物描述中{GameTurns}的值为GameTurns的值
        GameTurns[this]++;
        DynamicVars["GameTurns"].BaseValue = GameTurns[this];
        await CardPileCmd.Draw(choiceContext, DynamicVars.Cards.IntValue, player);
    }
}
```

`SavedAttachedState<TestRelic, int>`表示给`TestRelic`附加一个`int`类型的可保存状态。

```csharp
public static readonly SavedAttachedState<TestRelic, int> GameTurns = new("GameTurns", _ => 0);
```

* 第一个参数`"GameTurns"`是保存用的状态名，同一个对象类型里不要重复。

* 第二个参数`_ => 0`是默认值构造，读档时没有这个值就会使用`0`。

* 使用`GameTurns[this]`读取或修改当前遗物实例上的状态。

如果这个值需要显示在描述里，记得同时添加`DynamicVar`：

```csharp
protected override IEnumerable<DynamicVar> CanonicalVars => [
    new CardsVar(1),
    new DynamicVar("GameTurns", GameTurns[this])
];
```

本地化文本示例：

```json
{
  "TEST_RELIC_TEST_RELIC.title": "测试遗物",
  "TEST_RELIC_TEST_RELIC.description": "每回合开始时，抽[blue]{Cards}[/blue]张牌。\n已经历过[blue]{GameTurns}[/blue]回合了。",
  "TEST_RELIC_TEST_RELIC.flavor": "觉得很眼熟？"
}
```

这样`GameTurns`就会在局内保存和读取，不需要你自己额外写序列化逻辑。
