> 以下文章由AI编写，正在人工评阅，如有错误请提出。

`RitsuLib`提供了一套结构化的数据持久化层，支持作用域存储、档位切换、备份回退以及数据迁移。

`SavedAttachedState`已经在`数据保存`一章介绍过，这里介绍更通用的`ModDataStore`持久化方案。

## 注册数据

定义一个数据类，然后在初始化函数中注册：

```csharp
using STS2RitsuLib;
using STS2RitsuLib.Data;
using STS2RitsuLib.Utils.Persistence;

public sealed class CounterData
{
    public int Value { get; set; }
}

// 在初始化函数中
using (RitsuLibFramework.BeginModDataRegistration(ModId))
{
    var store = RitsuLibFramework.GetDataStore(ModId);

    store.Register<CounterData>(
        key: "counter",
        fileName: "counter.json",
        scope: SaveScope.Profile,
        defaultFactory: () => new CounterData(),
        autoCreateIfMissing: true);
}
```

* `key`：在store内部查找该条目的键。
* `fileName`：写入磁盘时使用的文件名。
* `scope`：`Global`或`Profile`。
* `defaultFactory`：没有文件或需要恢复时使用的默认值。
* `autoCreateIfMissing`：文件不存在时是否立即写出默认文件。

## Global与Profile作用域

* `Global`：所有档位共享。适合Mod设置、机器级缓存。
* `Profile`：按游戏档位隔离。适合解锁、进度等玩家数据。

## 读取与写入

```csharp
var store = RitsuLibFramework.GetDataStore(ModId);

// 读取
var counter = store.Get<CounterData>("counter");

// 修改
store.Modify<CounterData>("counter", data =>
{
    data.Value += 1;
});

// 保存
store.Save("counter");
```

* `Get<T>`返回的是当前注册条目的活动对象。
* 保存默认是显式的。

## 判断是否已有存档数据

```csharp
if (store.HasExistingData("counter"))
{
    // 磁盘上已经存在旧数据
}
```

常用于区分"首次初始化"和"读取旧存档"两种启动路径。

## 档位切换

档位作用域的数据会自动感知档位切换。RitsuLib会先把旧档位数据保存回旧档位路径，再从新档位路径重新加载。Mod不需要手写重绑定逻辑。

## 数据迁移

`Register<T>`支持同时传入迁移配置与迁移步骤：

```csharp
store.Register<MyData>(
    key: "settings",
    fileName: "settings.json",
    scope: SaveScope.Global,
    defaultFactory: () => new MyData(),
    migrationConfig: new ModDataMigrationConfig(
        currentDataVersion: 2,
        minimumSupportedDataVersion: 1),
    migrations:
    [
        new SettingsV1ToV2Migration(),
    ]);
```

* 没有migration config时，直接反序列化。
* 有config时，框架会先读取schema version字段，migration按版本顺序执行。
* 成功迁移后的数据会回写成新格式。

## 备份与恢复

持久化层会尽量采用保守策略：主文件读取失败时尝试备份回退，损坏文件可能被重命名为`.corrupt`，恢复失败则回退为默认值。
