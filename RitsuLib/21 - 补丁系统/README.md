`RitsuLib`在Harmony之上封装了一层补丁系统，统一了补丁声明、注册和失败处理。

## 基本流程

在初始化函数中创建patcher并注册补丁：

```csharp
using STS2RitsuLib;
using STS2RitsuLib.Patching.Core;

var patcher = RitsuLibFramework.CreatePatcher(ModId, "core-patches");
patcher.RegisterPatch<MySinglePatch>();
patcher.RegisterPatches<MyPatchSet>();

if (!patcher.PatchAll())
    throw new InvalidOperationException("补丁应用失败");
```

* 每个逻辑区域建议使用一个patcher。
* 先注册完所有补丁，最后统一调用一次`PatchAll()`。

## 编写单个补丁（IPatchMethod）

```csharp
using STS2RitsuLib.Patching.Models;

public class ExamplePatch : IPatchMethod
{
    public static string PatchId => "example_patch";
    public static string Description => "在方法执行时记录日志";
    public static bool IsCritical => false;

    public static ModPatchTarget[] GetTargets()
    {
        return [new(typeof(SomeType), nameof(SomeType.SomeMethod))];
    }

    public static void Prefix()
    {
        // Harmony prefix逻辑
    }
}
```

* `PatchId`在同一个patcher里必须唯一。
* `GetTargets()`可以返回一个或多个目标。
* `Prefix`、`Postfix`、`Transpiler`、`Finalizer`通过命名约定发现，写哪个就生效哪个。

## 分组注册（IModPatches）

一个类型统一注册多个补丁：

```csharp
using STS2RitsuLib.Patching.Core;
using STS2RitsuLib.Patching.Models;

public class MyPatchSet : IModPatches
{
    public static void AddTo(ModPatcher patcher)
    {
        patcher.RegisterPatch<ExamplePatch>();
        patcher.RegisterPatch<AnotherPatch>();
    }
}
```

注册方式：`patcher.RegisterPatches<MyPatchSet>();`

## Critical与Optional补丁

每个`IPatchMethod`都可以声明`IsCritical`：

* `true`：失败后`PatchAll()`会失败，patcher会回滚。缺少这个补丁Mod根本无法安全运行时使用。
* `false`：失败会记录日志，但patcher仍可能整体成功。适合兼容性补丁、最佳努力型功能。

## 忽略缺失目标

`ModPatchTarget`支持`ignoreIfMissing`：

```csharp
public static ModPatchTarget[] GetTargets()
{
    return [new(typeof(SomeType), "SomeOptionalMethod", ignoreIfMissing: true)];
}
```

* `ignoreIfMissing`表示"目标不存在也不算错误"。
* `IsCritical = false`表示"目标存在，但补丁失败不应终止整个patcher"。

## 一个补丁作用多个目标

```csharp
public static ModPatchTarget[] GetTargets()
{
    return [
        new(typeof(TypeA), nameof(TypeA.Method1)),
        new(typeof(TypeB), nameof(TypeB.Method2))
    ];
}
```

RitsuLib会自动展开成多个补丁，并把目标名附加到补丁标识上避免冲突。

## 动态补丁

当目标需要运行时发现时，使用`DynamicPatchBuilder`：

```csharp
using HarmonyLib;
using STS2RitsuLib.Patching.Builders;

var builder = new DynamicPatchBuilder("my_dynamic")
    .AddMethod(
        targetType: typeof(SomeType),
        methodName: "SomeMethod",
        postfix: DynamicPatchBuilder.FromMethod(typeof(MyRuntimePatch), nameof(MyRuntimePatch.Postfix)),
        isCritical: false,
        description: "运行时发现的补丁");

patcher.ApplyDynamic(builder, rollbackOnCriticalFailure: false);
```
