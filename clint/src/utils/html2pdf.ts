import { ca } from 'element-plus/es/locale';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export function htmlToPdf(element: Element, options?: any) {
  return new Promise((resolve, reject) => {
    try {
      // 获取滚动条的总高度 方便模拟滚动到最底部
      const totalScrollHeight = element.scrollHeight;
      // 使用html2canvas将DOM元素渲染为canvas
      html2canvas(element, {
        ...options,
        // scrollY: totalScrollHeight,
        onclone: clonedElement => {
          // 模拟滚动到底部
          clonedElement.scrollTop = totalScrollHeight;
        },
        height: totalScrollHeight
      }).then(canvas => {
        // 创建一个新的PDF文档
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' 表示纵向, 'mm' 表示单位毫米, 'a4' 是纸张大小

        // 添加图片到PDF文档
        const imgWidth = 210; // A4纸宽度为210mm
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgHeight * pdfWidth) / imgWidth;

        let position = 0;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pdfHeight);

        // 如果图片高度大于A4纸的高度，则需要分割图片
        if (pdfHeight > 297) {
          let heightLeft = pdfHeight;
          position = 0;
          pdf.addPage(); // 开始新的一页
          while (position < heightLeft) {
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, pdfHeight);
            heightLeft -= 297;
            position -= 297;
            if (position < 0) {
              position = 0;
            }
            if (heightLeft > 297) {
              pdf.addPage(); // 开始新的一页
            }
          }
        }
        resolve(pdf);
      });
    } catch (error) {
      reject(error);
    }
  });
}
export function downloadHandler(elementId) {
  return new Promise((resolve, reject) => {
    try {
      // elementId 为需要下载的元素的 id
      const element = document.getElementById(elementId);
      if (element) {
        html2canvas(element, {
          scale: 2, // 提高渲染质量
          useCORS: true, // 允许加载跨域图片
          onclone: clone => {
            // clone 为克隆出来的整个页面的 DOM 节点
            if (elementId) {
              const cloneDOM = clone.getElementById(elementId);
              // 将需要下载的元素的宽度调整为 A4 纸的宽度
              // 注意：这里的操作不会修改原 DOM，因此会和页面渲染的不一致，如果需要保持和页面一致则不需要此操作
              // cloneDOM.style.width = `592.28px`;
            }
          }
        }).then(canvas => {
          // canvas 渲染的是需要下载的元素
          const pdf = new jsPDF('p', 'pt', [592.28, 841.89]); // 创建一个 pdf
          const ctx = canvas.getContext('2d');
          const margin = 30; // pdf 每页的边距
          const a4w = 592.28 - 2 * margin,
            a4h = 841.89 - 2 * margin; // pdf 内容的宽高
          const imgHeight = Math.floor((a4h * canvas.width) / a4w); // 将 canvas 按 pdf 内容的高度分页，imgHeight 为分页的高度
          let renderedHeight = 0; // 已经添加到 pdf 的高度

          while (renderedHeight < canvas.height) {
            // canvas 没有全部添加到 pdf
            const page = document.createElement('canvas'); // 创建一个新的画布
            // 将 canvas 切割后渲染到新的画布上
            page.width = canvas.width;
            page.height = Math.min(imgHeight, canvas.height - renderedHeight);
            page.getContext('2d').putImageData(ctx.getImageData(0, renderedHeight, canvas.width, Math.min(imgHeight, canvas.height - renderedHeight)), 0, 0);
            // 将新画布生成图片并添加到 pdf 中
            pdf.addImage(page.toDataURL('image/jpeg', 1.0), 'JPEG', margin, margin, a4w, Math.min(a4h, (a4w * page.height) / page.width));
            renderedHeight += imgHeight;
            if (renderedHeight < canvas.height)
              // 如果 canvas 没有被全部添加到 pdf，则新增一页空白 pdf
              pdf.addPage();
            page.remove(); // 移除新的画布
          }
          // 保存 pdf
          resolve(pdf)
        });
      }
    } catch (error) {
      reject(error);
    }
  });
}
