import { Button, Space } from 'antd';
import { UserAddOutlined, ReloadOutlined } from '@ant-design/icons';
import { CommonTableButtonProps } from '../../../types';
import styles from './index.module.css';

function CommonTableButton({
  loading,
  onReload,
  onAdd,
  title,
  addButtonText,
  operations,
}: CommonTableButtonProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
      }}
    >
      <h2 className={styles.title}>{title}</h2>
      <Space>
        <Button icon={<ReloadOutlined />} onClick={onReload} loading={loading}>
          刷新
        </Button>
        {operations?.create && (
          <Button type='primary' icon={<UserAddOutlined />} onClick={onAdd}>
            {addButtonText}
          </Button>
        )}
      </Space>
    </div>
  );
}

export default CommonTableButton;
