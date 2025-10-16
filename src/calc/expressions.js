import  math  from 'mathjs';

//瞬时源
/**
 * 一维扩散公式函数
 * @param {number} x x方向到污染源距离
 * @param {number} t 时间
 * @param {number} M 单位面积上的投放质量
 * @param {number} D 扩散系数
 * @returns 指定点的浓度
 */
function calculate1D(x, t, M, D) {                         
  const denominator = Math.sqrt(4 * Math.PI * D * t);       
  const exponent = -((x * x) / (4 * D * t));
  const exponentialTerm = Math.exp(exponent);
  return (M / denominator) * exponentialTerm;
}

/**
 * 二维扩散公式函数
 * @param {number} x x方向到污染源距离
 * @param {number} y y方向到污染源距离
 * @param {number} t 时间
 * @param {number} M 单位深度上的投放质量
 * @param {number} Dx 扩散系数在x方向上的扩散系数
 * @param {number} Dy 扩散系数在y方向上的扩散系数
 * @returns 指定点的浓度
 */
function calculate2D(x, y, t, M, Dx, Dy) {                
  const denominator = 4 * Math.PI * t * Math.sqrt(Dx * Dy);
  const exponent = -((x * x) / (4 * Dx * t) + (y * y) / (4 * Dy * t));
  const exponentialTerm = Math.exp(exponent);
  return (M / denominator) * exponentialTerm;
}

/**
 * 三维扩散公式函数
 * @param {number} x x方向到污染源距离
 * @param {number} y y方向到污染源距离
 * @param {number} z z方向到污染源距离
 * @param {number} t 时间
 * @param {number} M 投放质量
 * @param {number} Dx 扩散系数在x方向上的扩散系数
 * @param {number} Dy 扩散系数在y方向上的扩散系数
 * @param {number} Dz 扩散系数在z方向上的扩散系数
 * @returns 指定点的浓度
 */
function calculate3D(x, y, z, t, M, Dx, Dy, Dz) {      
  const denominator = Math.sqrt(Math.pow(4 * Math.PI * t, 3) * Dx * Dy * Dz);
  const exponent = -((x * x) / (4 * Dx * t) + (y * y) / (4 * Dy * t) + (z * z) / (4 * Dz * t));
  const exponentialTerm = Math.exp(exponent);
  return (M / denominator) * exponentialTerm;
}

/**
 * 一维初始有限源公式函数
 * @param {number} x x方向到污染源距离
 * @param {number} t 时间
 * @param {number} C0 初始浓度
 * @param {number} D 扩散系数
 * @param {number} h 污染段的长度÷2
 * @returns 指定点的浓度
 */
function calculate1Dli(x, t, C0, D, h) {
  const inerf1 =((x+h)/Math.sqrt(4 * D * t));
  const inerf2 =((h-x)/Math.sqrt(4 * D * t))
  const erf1 = math.erf(inerf1);
  const erf2 = math.erf(inerf2);
  return C0 / 2 * (erf1 + erf2);
}

/**
 * 二维初始有限源公式函数
 * @param {number} x x方向到污染源距离
 * @param {number} y y方向到污染源距离
 * @param {number} t 时间
 * @param {number} C0 初始浓度
 * @param {number} D 扩散系数
 * @param {number} a 空间污染面的长÷2
 * @param {number} b 空间污染面的宽÷2
 * @returns 指定点的浓度
 */
function calculate2Dli(x, y, t, C0, D, a, b) {
  const course1 = calculate1Dli(x, t, C0, D, a);
  const course2 = calculate1Dli(y, t, C0, D, b);
  return course1 * course2 / C0;
}

/**
 * 三维初始有限源公式函数
 * @param {number} x x方向到污染源距离
 * @param {number} y y方向到污染源距离
 * @param {number} z z方向到污染源距离
 * @param {number} t 时间
 * @param {number} C0 初始浓度
 * @param {number} D 扩散系数
 * @param {number} a 空间污染体的长÷2
 * @param {number} b 空间污染体的宽÷2
 * @param {number} c 空间污染体的高÷2
 * @returns 指定点的浓度
 */
function calculate3Dli(x, y, z, t, C0, D, a, b, c) {
  const course1 = calculate1Dli(x, t, C0, D, a);
  const course2 = calculate1Dli(y, t, C0, D, b);
  const course3 = calculate1Dli(z, t, C0, D, c);
  return course1 * course2 * course3 / (C0 * C0);
}