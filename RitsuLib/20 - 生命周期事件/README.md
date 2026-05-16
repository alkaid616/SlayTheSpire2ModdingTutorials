> 以下文章由AI编写，正在人工评阅，如有错误请提出。

`RitsuLib`提供了一套生命周期事件系统，可以在游戏启动、跑局、战斗等各个阶段监听事件。

## 订阅方式

可在初始化函数订阅。（`Entry.Init`）选择你喜欢的方式订阅。

### lambda订阅

```csharp
using STS2RitsuLib;
using STS2RitsuLib.Lifecycle;

var sub = RitsuLibFramework.SubscribeLifecycle<GameReadyEvent>(evt =>
{
    Logger.Info($"游戏已就绪：{evt.Game}");
});

// 取消订阅
sub.Dispose();
```

### 接口订阅

也可以通过`ILifecycleObserver`接口订阅多种事件：

```csharp
public class MyObserver : ILifecycleObserver
{
    public void OnEvent(IFrameworkLifecycleEvent evt)
    {
        if (evt is CombatStartingEvent combat)
            HandleCombatStart(combat);
        else if (evt is RunEndedEvent run)
            HandleRunEnd(run);
    }
}
```

```csharp
RitsuLibFramework.SubscribeLifecycle(new MyObserver());
```

## 常用事件

以下列出常用的事件，完整列表参考`RitsuLib`源码。

### 框架事件

* `FrameworkInitializedEvent` — 框架初始化完成。
* `ProfileServicesInitializedEvent` — 档位服务初始化完成。

### 游戏引导事件

* `ContentRegistrationClosedEvent` — 内容注册冻结，此后不能再注册新内容。
* `ModelIdsInitializedEvent` — 模型ID初始化完成，可以安全获取`ModelDb.GetId<T>()`。
* `GameReadyEvent` — 游戏就绪。

### 跑局事件

* `RunStartedEvent` — 跑局开始，携带`RunState`、`IsMultiplayer`、`IsDaily`。
* `RunLoadedEvent` — 跑局读档。
* `RunEndedEvent` — 跑局结束，携带`IsVictory`、`IsAbandoned`。

### 房间与章节事件

* `RoomEnteringEvent` / `RoomEnteredEvent` / `RoomExitedEvent` — 房间进入/进入完成/离开。
* `ActEnteringEvent` / `ActEnteredEvent` — 章节进入/进入完成。

### 战斗事件

* `CombatStartingEvent` / `CombatEndedEvent` / `CombatVictoryEvent` — 战斗开始/结束/胜利。
* `SideTurnStartingEvent` / `SideTurnStartedEvent` — 回合开始/开始完成。
* `CardPlayingEvent` / `CardPlayedEvent` — 卡牌打出/打出完成。
* `CardDrawnEvent` — 抽牌，携带`Card`、`FromHandDraw`。
* `CardDiscardedEvent` / `CardExhaustedEvent` — 弃牌/消耗。
* `CreatureDyingEvent` / `CreatureDiedEvent` — 生物濒死/死亡。

### 奖励事件

* `GoldGainedEvent` / `GoldLostEvent` — 金币获得/失去。
* `RelicObtainedEvent` / `RelicRemovedEvent` — 遗物获得/移除。
* `PotionProcuredEvent` / `PotionDiscardedEvent` — 药水获得/丢弃。

### 解锁事件

* `EpochObtainedEvent` / `EpochRevealedEvent` — 时期获得/揭示。
* `UnlockIncrementedEvent` — 解锁进度增加。

### 存档事件

* `ProfileSwitchingEvent` / `ProfileSwitchedEvent` — 档位切换。
* `RunSavingEvent` / `RunSavedEvent` — 跑局存档。
* `ProfileDataReadyEvent` — 存档数据加载完毕，可安全读写。
