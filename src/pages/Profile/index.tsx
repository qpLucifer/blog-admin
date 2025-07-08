import React, { useState } from 'react';
import { Card, Descriptions, Avatar, Row, Col, Button, Input, Tooltip, Modal, Tag, Switch, message } from 'antd';
import { UserOutlined, EditOutlined, SmileOutlined, BulbOutlined, StarFilled } from '@ant-design/icons';
import styles from './index.module.css';
import { useSelector } from 'react-redux';
import { authReducer } from '../../types';
import { updateUserProfile } from '../../api/user';
import { useAppDispatch } from '../../hooks';
import { updateUserInfo } from '../../store/slices/authSlice';

const defaultBadges = [
  { name: '活跃分子', desc: '经常登录', icon: <StarFilled style={{ color: '#fadb14' }} /> },
  { name: '早起之星', desc: '早上7点前登录', icon: <SmileOutlined style={{ color: '#52c41a' }} /> },
  { name: '超级会员', desc: '尊贵身份', icon: <StarFilled style={{ color: '#722ed1' }} /> },
];

const Profile: React.FC = () => {
  const dispatch = useAppDispatch();
  const { user } = useSelector((state: authReducer) => state.auth);

  // 可编辑签名和心情
  const [signature, setSignature] = useState(user?.signature || '这个人很懒，什么都没写~');
  const [mood, setMood] = useState(user?.mood || '今天心情不错！');
  const [editSig, setEditSig] = useState(false);
  const [editMood, setEditMood] = useState(false);
  // 徽章弹窗
  const [badgeModal, setBadgeModal] = useState(false);
  // 主题切换
  const [dark, setDark] = useState(false);

  // 保存签名/心情（可接接口）
  const handleSave = async (type: 'signature' | 'mood', value: string) => {
    if (type === 'signature') {
      setSignature(value);
      setEditSig(false);
      await updateUserProfile(user?.id as number, { signature: value });
      message.success('签名已保存！');
      dispatch(updateUserInfo({ signature: value }));
    } else {
      setMood(value);
      setEditMood(false);
      await updateUserProfile(user?.id as number, { mood: value });
      message.success('心情已保存！');
      dispatch(updateUserInfo({ mood: value }));
    }
    // TODO: 可调用后端接口保存
  };

  // 主题切换
  const handleThemeChange = (checked: boolean) => {
    setDark(checked);
    document.body.setAttribute('data-theme', checked ? 'dark' : 'light');
  };

  return (
    <div className={styles.profileBg + (dark ? ' ' + styles.dark : '')}>
      {/* 顶部波浪渐变背景 */}
      <div className={styles.waveBg} />
      <Row justify="center" >
        <Col xs={24} sm={18} md={12} lg={8}>
          <Card
            className={styles.card}
            title={
              <span>
                <Avatar
                  size={64}
                  icon={<UserOutlined />}
                  style={{
                    background: 'linear-gradient(135deg, #a18cd1 0%, #6a4bc6 100%)',
                    marginRight: 16,
                    boxShadow: '0 0 16px #a18cd1',
                    border: '3px solid #fff',
                  }}
                  className={styles.avatarGlow}
                />
                个人中心
                <Switch
                  checkedChildren={<BulbOutlined />}
                  unCheckedChildren={<BulbOutlined />}
                  checked={dark}
                  onChange={handleThemeChange}
                  style={{ marginLeft: 16 }}
                />
                <span style={{ fontSize: 12, marginLeft: 8 }}>{dark ? '暗色' : '亮色'}</span>
              </span>
            }
            extra={
              <Tooltip title="查看我的徽章">
                <Button shape="circle" icon={<StarFilled />} onClick={() => setBadgeModal(true)} />
              </Tooltip>
            }
          >
            <Descriptions column={1}>
              <Descriptions.Item label="用户名">{user?.username}</Descriptions.Item>
              <Descriptions.Item label="角色">{user?.roles?.join(', ')}</Descriptions.Item>
              <Descriptions.Item label="邮箱">{user?.email}</Descriptions.Item>
              <Descriptions.Item label="个性签名">
                {editSig ? (
                  <span>
                    <Input
                      defaultValue={signature}
                      maxLength={30}
                      style={{ width: 180 }}
                      onPressEnter={e => handleSave('signature', (e.target as HTMLInputElement).value)}
                      onBlur={e => handleSave('signature', (e.target as HTMLInputElement).value)}
                      autoFocus
                    />
                  </span>
                ) : (
                  <span>
                    {signature} <EditOutlined onClick={() => setEditSig(true)} style={{ marginLeft: 8, color: '#a18cd1', cursor: 'pointer' }} />
                  </span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="今日心情">
                {editMood ? (
                  <span>
                    <Input
                      defaultValue={mood}
                      maxLength={20}
                      style={{ width: 140 }}
                      onPressEnter={e => handleSave('mood', (e.target as HTMLInputElement).value)}
                      onBlur={e => handleSave('mood', (e.target as HTMLInputElement).value)}
                      autoFocus
                    />
                  </span>
                ) : (
                  <span>
                    {mood} <EditOutlined onClick={() => setEditMood(true)} style={{ marginLeft: 8, color: '#52c41a', cursor: 'pointer' }} />
                  </span>
                )}
              </Descriptions.Item>
              <Descriptions.Item label="我的徽章">
                {defaultBadges.map(b => (
                  <Tag key={b.name} color="purple" className={styles.badgeTag} style={{ marginBottom: 4, cursor: 'pointer' }} onClick={() => setBadgeModal(true)}>
                    {b.icon} {b.name}
                  </Tag>
                ))}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      {/* 徽章弹窗 */}
      <Modal
        title="我的徽章"
        open={badgeModal}
        onCancel={() => setBadgeModal(false)}
        footer={null}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          {defaultBadges.map(b => (
            <Card key={b.name} hoverable style={{ width: 120, textAlign: 'center' }}>
              <div style={{ fontSize: 32 }}>{b.icon}</div>
              <div style={{ fontWeight: 'bold', margin: '8px 0 4px' }}>{b.name}</div>
              <div style={{ fontSize: 12, color: '#888' }}>{b.desc}</div>
            </Card>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default Profile; 