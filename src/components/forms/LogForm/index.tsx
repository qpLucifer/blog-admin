import React, { useEffect } from 'react';
import { Form, Input, InputNumber, Select, Switch, Space, Card, Divider } from 'antd';
import { ClockCircleOutlined, DeleteOutlined, SettingOutlined } from '@ant-design/icons';

const { Option } = Select;

interface LogFormProps {
  form: any;
  initialValues?: any;
  type: 'clean' | 'realtime' | 'viewer';
  onValuesChange?: (changedValues: any, allValues: any) => void;
}

const LogForm: React.FC<LogFormProps> = ({ form, initialValues, type, onValuesChange }) => {
  useEffect(() => {
    if (initialValues) {
      form.setFieldsValue(initialValues);
    }
  }, [form, initialValues]);

  // 日志清理表单
  const renderCleanForm = () => (
    <Card
      title={
        <Space>
          <DeleteOutlined />
          日志清理配置
        </Space>
      }
    >
      <Form.Item
        label='保留天数'
        name='days'
        rules={[
          { required: true, message: '请输入保留天数' },
          { type: 'number', min: 1, max: 365, message: '保留天数必须在1-365之间' },
        ]}
        tooltip='删除指定天数之前的日志文件'
      >
        <InputNumber
          min={1}
          max={365}
          placeholder='请输入保留天数'
          addonAfter='天'
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item label='文件类型' name='fileTypes' tooltip='选择要清理的日志文件类型'>
        <Select mode='multiple' placeholder='选择要清理的文件类型' allowClear>
          <Option value='error'>错误日志</Option>
          <Option value='auth'>认证日志</Option>
          <Option value='business'>业务日志</Option>
          <Option value='system'>系统日志</Option>
        </Select>
      </Form.Item>

      <Form.Item label='大小限制' name='sizeLimit' tooltip='只清理超过指定大小的文件（MB）'>
        <InputNumber min={0} placeholder='文件大小限制' addonAfter='MB' style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label='确认清理'
        name='confirm'
        valuePropName='checked'
        rules={[
          {
            validator: (_, value) =>
              value ? Promise.resolve() : Promise.reject(new Error('请确认执行清理操作')),
          },
        ]}
      >
        <Switch checkedChildren='确认' unCheckedChildren='取消' />
      </Form.Item>
    </Card>
  );

  // 实时更新配置表单
  const renderRealtimeForm = () => (
    <Card
      title={
        <Space>
          <ClockCircleOutlined />
          实时更新配置
        </Space>
      }
    >
      <Form.Item label='启用实时更新' name='enabled' valuePropName='checked'>
        <Switch checkedChildren='开启' unCheckedChildren='关闭' />
      </Form.Item>

      <Form.Item
        label='刷新间隔'
        name='interval'
        rules={[
          { required: true, message: '请输入刷新间隔' },
          { type: 'number', min: 1000, message: '刷新间隔不能少于1秒' },
        ]}
        tooltip='自动刷新的时间间隔（毫秒）'
      >
        <InputNumber
          min={1000}
          max={60000}
          step={1000}
          placeholder='刷新间隔'
          addonAfter='毫秒'
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label='最大条目数'
        name='maxEntries'
        rules={[
          { required: true, message: '请输入最大条目数' },
          { type: 'number', min: 10, max: 1000, message: '最大条目数必须在10-1000之间' },
        ]}
        tooltip='实时显示的最大日志条目数'
      >
        <InputNumber min={10} max={1000} placeholder='最大条目数' style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label='自动滚动'
        name='autoScroll'
        valuePropName='checked'
        tooltip='新日志出现时自动滚动到底部'
      >
        <Switch checkedChildren='开启' unCheckedChildren='关闭' />
      </Form.Item>

      <Form.Item label='日志级别过滤' name='levelFilter' tooltip='只显示指定级别的日志'>
        <Select mode='multiple' placeholder='选择要显示的日志级别' allowClear>
          <Option value='error'>错误</Option>
          <Option value='warn'>警告</Option>
          <Option value='info'>信息</Option>
          <Option value='debug'>调试</Option>
          <Option value='verbose'>详细</Option>
        </Select>
      </Form.Item>
    </Card>
  );

  // 查看器配置表单
  const renderViewerForm = () => (
    <Card
      title={
        <Space>
          <SettingOutlined />
          查看器配置
        </Space>
      }
    >
      <Form.Item label='主题' name='theme' rules={[{ required: true, message: '请选择主题' }]}>
        <Select placeholder='选择主题'>
          <Option value='light'>浅色主题</Option>
          <Option value='dark'>深色主题</Option>
        </Select>
      </Form.Item>

      <Form.Item
        label='字体大小'
        name='fontSize'
        rules={[
          { required: true, message: '请输入字体大小' },
          { type: 'number', min: 10, max: 24, message: '字体大小必须在10-24之间' },
        ]}
      >
        <InputNumber
          min={10}
          max={24}
          placeholder='字体大小'
          addonAfter='px'
          style={{ width: '100%' }}
        />
      </Form.Item>

      <Form.Item
        label='行高'
        name='lineHeight'
        rules={[
          { required: true, message: '请输入行高' },
          { type: 'number', min: 1, max: 3, message: '行高必须在1-3之间' },
        ]}
      >
        <InputNumber min={1} max={3} step={0.1} placeholder='行高' style={{ width: '100%' }} />
      </Form.Item>

      <Divider>显示选项</Divider>

      <Form.Item label='显示行号' name='showLineNumbers' valuePropName='checked'>
        <Switch checkedChildren='显示' unCheckedChildren='隐藏' />
      </Form.Item>

      <Form.Item label='显示时间戳' name='showTimestamp' valuePropName='checked'>
        <Switch checkedChildren='显示' unCheckedChildren='隐藏' />
      </Form.Item>

      <Form.Item label='显示日志级别' name='showLevel' valuePropName='checked'>
        <Switch checkedChildren='显示' unCheckedChildren='隐藏' />
      </Form.Item>

      <Form.Item label='显示元数据' name='showMetadata' valuePropName='checked'>
        <Switch checkedChildren='显示' unCheckedChildren='隐藏' />
      </Form.Item>

      <Form.Item label='自动换行' name='wordWrap' valuePropName='checked'>
        <Switch checkedChildren='开启' unCheckedChildren='关闭' />
      </Form.Item>

      <Form.Item
        label='高亮关键词'
        name='highlightKeywords'
        tooltip='输入要高亮显示的关键词，用逗号分隔'
      >
        <Input.TextArea placeholder='输入关键词，用逗号分隔' rows={3} />
      </Form.Item>
    </Card>
  );

  return (
    <Form
      form={form}
      layout='vertical'
      onValuesChange={onValuesChange}
      initialValues={initialValues}
    >
      {type === 'clean' && renderCleanForm()}
      {type === 'realtime' && renderRealtimeForm()}
      {type === 'viewer' && renderViewerForm()}
    </Form>
  );
};

export default LogForm;
