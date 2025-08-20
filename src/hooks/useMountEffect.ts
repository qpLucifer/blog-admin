import { useEffect, useRef } from 'react';

/**
 * 自定义Hook，用于在组件挂载时执行一次，防止React.StrictMode下的重复调用
 * @param effect 要执行的effect函数
 */
export function useMountEffect(effect: () => void | (() => void)) {
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return effect();
    }
  }, [effect]);
}
