import React, { useEffect, useRef, useState } from 'react';
import { Form, Input, Select, Switch, Upload, Button, Modal, InputNumber } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { TagData } from '../../../types';
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor } from '@wangeditor/editor';
import axios from 'axios';

const { Option } = Select;

interface BlogFormProps {
  isEdit?: boolean;
  tags?: TagData[];
  initialValues?: any;
  onSubmit?: (values: any) => void;
}

const BlogForm: React.FC<BlogFormProps> = ({
  isEdit = false,
  tags = [],
  initialValues = {},
  onSubmit,
}) => {
  const [form] = Form.useForm();
  const [coverFileList, setCoverFileList] = useState<any[]>([]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
    if (!initialValues || Object.keys(initialValues).length === 0) {
      form.resetFields(); // 新增时重置表单
      setCoverFileList([]);
    }
    if (initialValues && initialValues.cover_image) {
      setCoverFileList([
        {
          uid: '1',
          name: 'cover_image',
          status: 'done',
          url: process.env.REACT_APP_IMAGE_BASE_URL + initialValues.cover_image,
        },
      ]);
    }
  }, [initialValues, form]);

  // 图片上传
  const uploadProps = {
    name: 'file',
    action: 'http://localhost:3000/api/upload/image',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
    listType: 'picture-card' as const,
    showUploadList: true,
    fileList: coverFileList,
    maxCount: 1,
    onChange(info: any) {
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1);
      if (info.file.status === 'done') {
        form.setFieldValue('cover_image', fileList[0].response.data.url);
      }
      setCoverFileList(fileList);
    },
    onRemove() {
      form.setFieldValue('cover_image', '');
      setCoverFileList([]);
    },
    beforeUpload: () => true,
  };

  // 富文本图片上传配置
  const customUpload = async (file: File, insertFn: (url: string) => void) => {
    const formData = new FormData();
    formData.append('file', file);
    const res: any = await axios.post('/api/upload', formData);
    insertFn(res.data.url);
  };

  const EditorComponent = ({ value = '', onChange }: any) => {
    const editorRef = useRef<IDomEditor | null>(null);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [editor, setEditor] = useState<IDomEditor | null>(null);

    // 监听 value 变化，更新编辑器内容
    useEffect(() => {
      if (editor && value !== editor.getHtml()) {
        editor.setHtml(value);
      }
    }, [value, editor]);

    useEffect(() => {
      return () => {
        if (editorRef.current) {
          editorRef.current.destroy();
          editorRef.current = null;
        }
      };
    }, []);

    const handleEditorChange = (editor: IDomEditor) => {
      onChange(editor.getHtml());
    };
    return (
      <div>
        <Toolbar
          editor={editor}
          defaultConfig={{}}
          mode='default'
          style={{ borderBottom: '1px solid #eee' }}
        />
        <Editor
          defaultConfig={{
            MENU_CONF: {
              uploadImage: {
                customUpload,
              },
            },
          }}
          value={value}
          onCreated={(ed: IDomEditor) => {
            editorRef.current = ed;
            setEditor(ed);
          }}
          onChange={handleEditorChange}
          mode='default'
          style={{ minHeight: 300, border: '1px solid #eee', borderRadius: 4, marginBottom: 8 }}
        />
        <Button
          icon={<EyeOutlined />}
          onClick={() => setPreviewVisible(true)}
          style={{ marginBottom: 8 }}
        >
          预览
        </Button>
        <Modal
          title='内容预览'
          open={previewVisible}
          onCancel={() => setPreviewVisible(false)}
          footer={null}
          width={800}
        >
          <div dangerouslySetInnerHTML={{ __html: value }} />
        </Modal>
      </div>
    );
  };

  return (
    <Form form={form} layout='vertical' initialValues={initialValues} onFinish={onSubmit}>
      <Form.Item name='title' label='标题' rules={[{ required: true, message: '请输入标题' }]}>
        <Input placeholder='请输入标题' />
      </Form.Item>
      <Form.Item
        name='cover_image'
        label='封面图片'
        valuePropName='cover_image'
        // getValueFromEvent={() => {debugger;return coverFileList[0]?.response?.url || ''}}
      >
        <Upload {...uploadProps}>
          {coverFileList.length >= 1 ? null : (
            <div>
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>上传</div>
            </div>
          )}
        </Upload>
      </Form.Item>
      <Form.Item
        name='content'
        label='正文内容'
        rules={[{ required: true, message: '请输入正文内容' }]}
      >
        <EditorComponent />
      </Form.Item>
      <Form.Item name='summary' label='摘要' rules={[]}>
        <Input.TextArea rows={2} placeholder='请输入摘要' />
      </Form.Item>
      <Form.Item name='tags' label='标签'>
        <Select mode='multiple' placeholder='请选择标签' optionFilterProp='children'>
          {tags.map(tag => (
            <Option key={tag.id} value={tag.id}>
              {tag.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item name='is_published' label='发布状态' valuePropName='checked' initialValue={true}>
        <Switch checkedChildren='已发布' unCheckedChildren='未发布' />
      </Form.Item>
      <Form.Item name='is_choice' label='精选状态' valuePropName='checked' initialValue={false}>
        <Switch checkedChildren='已精选' unCheckedChildren='未精选' />
      </Form.Item>
      <Form.Item
        name='need_time'
        label='需要时间'
        rules={[{ required: true, message: '请输入需要时间' }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item>
        <Button
          type='primary'
          htmlType='submit'
          block
          size='large'
          style={{
            background: 'linear-gradient(90deg,#a18cd1,#fbc2eb)',
            border: 'none',
            fontWeight: 700,
          }}
        >
          {isEdit ? '保存修改' : '发布博客'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default BlogForm;
