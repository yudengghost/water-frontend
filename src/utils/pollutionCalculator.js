import { erf } from 'mathjs';

/* ==================== 瞬时源公式 ==================== */

/**
 * 一维瞬时源扩散公式
 * @param {number} x x方向到污染源距离
 * @param {number} t 时间
 * @param {number} M 单位面积上的投放质量
 * @param {number} D 扩散系数
 * @returns 指定点的浓度
 */
export function calculate1D(x, t, M, D) {
  if (t <= 0 || D <= 0 || M <= 0) return 0;
  
  const denominator = Math.sqrt(4 * Math.PI * D * t);
  const exponent = -((x * x) / (4 * D * t));
  
  // 避免指数过小导致的数值下溢
  if (exponent < -100) return 0;
  
  const exponentialTerm = Math.exp(exponent);
  const result = (M / denominator) * exponentialTerm;
  
  return isNaN(result) || !isFinite(result) ? 0 : result;
}

/**
 * 二维瞬时源扩散公式
 * @param {number} x x方向到污染源距离
 * @param {number} y y方向到污染源距离
 * @param {number} t 时间
 * @param {number} M 单位深度上的投放质量
 * @param {number} Dx 扩散系数在x方向上的扩散系数
 * @param {number} Dy 扩散系数在y方向上的扩散系数
 * @returns 指定点的浓度
 */
export function calculate2D(x, y, t, M, Dx, Dy) {
  if (t <= 0 || M <= 0 || Dx <= 0 || Dy <= 0) return 0;
  
  const denominator = 4 * Math.PI * t * Math.sqrt(Dx * Dy);
  const exponent = -((x * x) / (4 * Dx * t) + (y * y) / (4 * Dy * t));
  
  // 避免指数过小导致的数值下溢
  if (exponent < -100) return 0;
  
  const exponentialTerm = Math.exp(exponent);
  const result = (M / denominator) * exponentialTerm;
  
  return isNaN(result) || !isFinite(result) ? 0 : result;
}

/**
 * 三维瞬时源扩散公式
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
export function calculate3D(x, y, z, t, M, Dx, Dy, Dz) {
  if (t <= 0 || M <= 0 || Dx <= 0 || Dy <= 0 || Dz <= 0) return 0;
  
  const denominator = Math.sqrt(Math.pow(4 * Math.PI * t, 3) * Dx * Dy * Dz);
  const exponent = -((x * x) / (4 * Dx * t) + (y * y) / (4 * Dy * t) + (z * z) / (4 * Dz * t));
  
  // 避免指数过小导致的数值下溢
  if (exponent < -100) return 0;
  
  const exponentialTerm = Math.exp(exponent);
  const result = (M / denominator) * exponentialTerm;
  
  return isNaN(result) || !isFinite(result) ? 0 : result;
}

/* ==================== 初始有限源公式 ==================== */

/**
 * 一维初始有限源公式
 * @param {number} x x方向到污染源距离
 * @param {number} t 时间
 * @param {number} C0 初始浓度
 * @param {number} D 扩散系数
 * @param {number} h 污染段的长度÷2
 * @returns 指定点的浓度
 */
export function calculate1Dli(x, t, C0, D, h) {
  if (C0 <= 0 || D <= 0 || h <= 0) return 0;
  if (t <= 0) return x >= -h && x <= h ? C0 : 0;
  
  const inerf1 = ((x + h) / Math.sqrt(4 * D * t));
  const inerf2 = ((h - x) / Math.sqrt(4 * D * t));
  const erf1 = erf(inerf1);
  const erf2 = erf(inerf2);
  const result = C0 / 2 * (erf1 + erf2);
  
  return isNaN(result) || !isFinite(result) ? 0 : result;
}

/**
 * 二维初始有限源公式
 * @param {number} x x方向到污染源距离
 * @param {number} y y方向到污染源距离
 * @param {number} t 时间
 * @param {number} C0 初始浓度
 * @param {number} D 扩散系数
 * @param {number} a 空间污染面的长÷2
 * @param {number} b 空间污染面的宽÷2
 * @returns 指定点的浓度
 */
export function calculate2Dli(x, y, t, C0, D, a, b) {
  if (C0 <= 0) return 0;
  
  const course1 = calculate1Dli(x, t, C0, D, a);
  const course2 = calculate1Dli(y, t, C0, D, b);
  const result = course1 * course2 / C0;
  
  return isNaN(result) || !isFinite(result) ? 0 : result;
}

/**
 * 三维初始有限源公式
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
export function calculate3Dli(x, y, z, t, C0, D, a, b, c) {
  if (C0 <= 0) return 0;
  
  const course1 = calculate1Dli(x, t, C0, D, a);
  const course2 = calculate1Dli(y, t, C0, D, b);
  const course3 = calculate1Dli(z, t, C0, D, c);
  const result = course1 * course2 * course3 / (C0 * C0);
  
  return isNaN(result) || !isFinite(result) ? 0 : result;
}

/* ==================== 反演计算 ==================== */

/**
 * 一维瞬时源反演：根据观测到的浓度、时间等参数反推污染源距离
 * @param {number} D 扩散系数
 * @param {number} t 时间
 * @param {number} C 观测到的浓度
 * @param {number} M 投放质量
 * @returns {number} 污染源距离 x（正值）
 */
export function inverseCalculate1D(D, t, C, M) {
  // 参数验证
  if (D <= 0 || t <= 0 || C <= 0 || M <= 0) {
    return 0;
  }
  
  try {
    // 计算括号内的表达式：C / M * sqrt(4 * pi * D * t)
    const term = C / M * Math.sqrt(4 * Math.PI * D * t);
    
    // 检查term是否有效（必须小于1，因为要取对数）
    if (term <= 0 || term >= 1) {
      console.warn('反演计算参数无效：term值超出范围', term);
      return 0;
    }
    
    // 计算 x^2 = -4 * D * t * ln(term)
    const x_squared = -4 * D * t * Math.log(term);
    
    // 检查x_squared是否为正数
    if (x_squared < 0) {
      console.warn('反演计算结果无效：x_squared为负数', x_squared);
      return 0;
    }
    
    // 计算 x（取正值，因为距离为正）
    const x = Math.sqrt(x_squared);
    
    return isNaN(x) || !isFinite(x) ? 0 : x;
  } catch (error) {
    console.error('反演计算出错:', error);
    return 0;
  }
}

