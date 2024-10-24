// 全局页面初始化文件

// 使用全局事件监听器时，可以添加更具体的类型注解
window.addEventListener('resize', setFontSize);

// 禁止右键
document.oncontextmenu = function (event: MouseEvent): boolean {
  return false;
};

// 设置html font-size
function setFontSize(): void {
  // 获取视窗宽度，这里可以添加类型注解
  const htmlWidth: number = document.documentElement.clientWidth || document.body.clientWidth;
  // 获取html - DOM
  const htmlDom: HTMLHtmlElement = document.getElementsByTagName('html')[0];
  htmlDom.style.fontSize = `${htmlWidth / 100}px`;
}
// 如果在模块中使用，可能需要导出函数
export { setFontSize };
