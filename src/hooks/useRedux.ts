import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import type { RootState, AppDispatch } from '../store';

// 使用类型化的dispatch和selector
export const useAppDispatch = () => useDispatch<AppDispatch>();

// 自定义useSelector，使用类型化的state
// 这样使用useAppSelector时，state会被自动类型检查
// 同时，useAppSelector返回值也会被自动类型检查
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector; 