import { useEffect, useRef } from 'react';

/**
 * 自定义Hook，用于防止在React.StrictMode下重复调用effect
 * @param effect 要执行的effect函数
 * @param deps 依赖数组
 */
export function useInitialEffect(
  effect: () => void | (() => void),
  deps: React.DependencyList = []
) {
  const hasInitialized = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (!hasInitialized.current) {
      isFirstRender.current = false;
      hasInitialized.current = true;
      return effect();
    } else {
      // 后续依赖项变化时正常调用
      hasInitialized.current = true;
      return effect();
    }
  }, deps);
}

/**
 * 自定义Hook，用于防止在React.StrictMode下重复调用异步函数
 * 只在组件首次挂载时调用一次，不会阻止依赖项变化时的正常调用
 * @param asyncFunction 异步函数
 * @param deps 依赖数组
 */
export function useInitialAsyncEffect(
  asyncFunction: () => Promise<any>,
  deps: React.DependencyList = []
) {
  const hasInitialized = useRef(false);
  const isFirstRender = useRef(true);

  useEffect(() => {
    // 只在首次渲染时调用，防止React.StrictMode下的重复调用
    if (isFirstRender.current) {
      isFirstRender.current = false;
      hasInitialized.current = true;
      asyncFunction();
    } else {
      // 后续依赖项变化时正常调用
      hasInitialized.current = true;
      asyncFunction();
    }
  }, deps);
}
