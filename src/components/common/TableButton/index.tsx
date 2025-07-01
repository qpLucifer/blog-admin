import { Button ,Space} from 'antd';
import styles from './index.module.css';
import { UserAddOutlined, ReloadOutlined } from '@ant-design/icons';

interface CommonTableButtonProps<T = any> {
  loading?: boolean;
  onReload?: () => void;
  onAdd?: () => void;
  title?: string;
  addButtonText?: string;
}

function CommonTableButton<T = any>({
  loading,
  onReload,
  onAdd,
  title,
  addButtonText,
}: CommonTableButtonProps<T>) {
  

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 className={styles.title}>{title}</h2>
        <Space>
          <Button 
            icon={<ReloadOutlined />} 
            onClick={onReload}
            loading={loading}
          >
            刷新
          </Button>
          <Button type="primary" icon={<UserAddOutlined />} onClick={onAdd}>
            {addButtonText}
          </Button>
        </Space>
      </div>
  );
}

export default CommonTableButton; 