`RitsuLib`提供了一套运行时热键注册系统，支持多绑定、重绑定、修饰键和文本输入时自动抑制。

## 注册热键

```csharp
using STS2RitsuLib.RuntimeInput;

var handle = RuntimeHotkeyService.Register("Ctrl+Shift+R", () =>
{
    Logger.Info("热键已触发！");
}, new RuntimeHotkeyOptions
{
    Id = "my_mod_reload",
    DisplayName = new("重新加载配置"),
    Description = new("重新加载 Mod 配置文件。"),
    Category = new("My Mod"),
});
```

* `Register`方法解析绑定字符串、验证它，并返回一个`IRuntimeHotkeyHandle`。

## 多绑定

注册多个绑定，都触发同一个回调：

```csharp
var handle = RuntimeHotkeyService.Register(
    ["F5", "Ctrl+Shift+R"],
    () => RefreshUI(),
    new RuntimeHotkeyOptions { Id = "my_mod_refresh" }
);
```

相同的规范化绑定会自动去重。

## 重绑定

```csharp
if (handle.TryRebind("Ctrl+Alt+R", out var normalized))
{
    SaveToConfig(normalized);
}
```

## 选项

`RuntimeHotkeyOptions`的常用属性：

* `Id`：用于查找的稳定标识符。
* `DisplayName`：用于UI的人类可读名称。
* `Description`：热键的功能描述。
* `Category`：用于UI分组的类别。
* `MarkInputHandled`：标记输入事件为已处理。
* `SuppressWhenTextInputFocused`：文本输入激活时抑制（默认true）。
* `SuppressWhenDevConsoleVisible`：开发控制台可见时抑制（默认true）。

## Handle API

`IRuntimeHotkeyHandle`（实现`IDisposable`）提供生命周期控制：

* `CurrentBinding` / `CurrentBindings` — 当前绑定。
* `IsRegistered` — 是否仍在活跃。
* `TryRebind(...)` — 重绑定。
* `Unregister()` / `Dispose()` — 注销。

## 查询注册

```csharp
// 获取所有活跃注册
foreach (var info in RuntimeHotkeyService.GetRegisteredHotkeyDetails())
{
    Logger.Info($"{info.Id}: {string.Join(" / ", info.CurrentBindings)}");
}
```

## 绑定格式

格式：`[Modifier+][Modifier+]Key`

支持的修饰键：`Ctrl`、`Alt`、`Shift`、`Meta`

示例：`F5`、`Ctrl+S`、`Ctrl+Shift+R`、`Alt+F4`
