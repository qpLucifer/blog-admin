import React, { useState, useMemo } from 'react';
import { Select, Input, Space, Card, Row, Col } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import * as AllIcons from '@ant-design/icons';
import { ICON_LIST, filterIcons } from '../../../constants/icons';
import styles from './index.module.css';

const { Search } = Input;

interface IconSelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
}

const IconSelector: React.FC<IconSelectorProps> = ({
  value,
  onChange,
  placeholder = '请选择图标'
}) => {
  const [searchText, setSearchText] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // 过滤后的图标列表
  const filteredIcons = useMemo(() => {
    return filterIcons(searchText);
  }, [searchText]);

  // 获取图标组件
  const getIconComponent = (iconName: string) => {
    const IconComponent = (AllIcons as any)[iconName];
    return IconComponent ? <IconComponent /> : null;
  };

  // 获取当前选中图标的显示名称
  const getSelectedIconName = () => {
    const selectedIcon = ICON_LIST.find(icon => icon.value === value);
    return selectedIcon ? selectedIcon.name : '';
  };

  const handleSelect = (iconValue: string) => {
    onChange?.(iconValue);
    setIsOpen(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };

  return (
    <Select
      value={value}
      onChange={handleSelect}
      placeholder={placeholder}
      open={isOpen}
      onOpenChange={setIsOpen}
      popupRender={() => (
        <div style={{ padding: '8px' }}>
          <Search
            placeholder="搜索图标..."
            value={searchText}
            onChange={handleSearch}
            className={styles.searchInput}
            prefix={<SearchOutlined />}
          />
          <div className={styles.iconGrid}>
            <Row gutter={[8, 8]}>
              {filteredIcons.map((icon) => {
                const IconComponent = (AllIcons as any)[icon.value];
                return (
                  <Col span={6} key={icon.value}>
                    <Card
                      size="small"
                      hoverable
                      className={`${styles.iconCard} ${value === icon.value ? styles.selected : ''}`}
                      onClick={() => handleSelect(icon.value)}
                    >
                      <div className={styles.iconContainer}>
                        {IconComponent && <IconComponent style={{ fontSize: '20px' }} />}
                      </div>
                      <div className={styles.iconName}>
                        {icon.name}
                      </div>
                    </Card>
                  </Col>
                );
              })}
            </Row>
          </div>
        </div>
      )}
      style={{ width: '100%' }}
    >
      {value && (
        <Select.Option value={value}>
          <Space>
            {getIconComponent(value)}
            <span>{getSelectedIconName()}</span>
          </Space>
        </Select.Option>
      )}
    </Select>
  );
};

export default IconSelector; 