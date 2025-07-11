import React, { useRef, useState } from 'react';
import { Form, Input, Select, Switch, Upload, Button, Modal } from 'antd';
import { PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { BlogData, TagData } from '../../../types';
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-react';
import { IDomEditor } from '@wangeditor/editor';
import axios from 'axios';

const { Option } = Select;

interface BlogFormProps {
  isEdit?: boolean;
  tags?: TagData[];
}

const BlogForm: React.FC<BlogFormProps> = ({ isEdit = false, tags = [] }) => {
  // const [editorHtml, setEditorHtml] = useState('');
  const [previewVisible, setPreviewVisible] = useState(false);
  const [coverFileList, setCoverFileList] = useState<any[]>([]);
  const editorRef = useRef<IDomEditor | null>(null);

  // 富文本内容变更
  // const handleEditorChange = (editor: IDomEditor) => {
  //   debugger
  //   setEditorHtml(editor.getHtml());
  // };

  // 图片上传
  const uploadProps = {
    name: 'file',
    action: 'http://localhost:3000/api/upload/image',
    listType: 'picture-card' as const,
    showUploadList: true,
    maxCount: 1,
    onChange(info: any) {
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1);
      setCoverFileList(fileList);
    },
    onRemove() {
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
    const handleEditorChange = (editor: IDomEditor) => {
      onChange(editor.getHtml());
    }
    return (
      <div>
          <Toolbar
            editor={editorRef.current}
            defaultConfig={{}}
            mode="default"
            style={{ borderBottom: '1px solid #eee' }}
          />
          <Editor
            defaultConfig={{
              MENU_CONF: {
                uploadImage: {
                  customUpload
                }
              }
            }}
            value={value}
            onCreated={(editor: IDomEditor) => (editorRef.current = editor)}
            onChange={handleEditorChange}
            mode="default"
            style={{ minHeight: 200, border: '1px solid #eee', borderRadius: 4, marginBottom: 8 }}
          />
          <Button icon={<EyeOutlined />} onClick={() => setPreviewVisible(true)} style={{ marginBottom: 8 }}>
            预览
          </Button>
          <Modal
            title="内容预览"
            open={previewVisible}
            onCancel={() => setPreviewVisible(false)}
            footer={null}
            width={800}
          >
            <div dangerouslySetInnerHTML={{ __html: value }} />
          </Modal>
        </div>
    )
  }

  return (
    <>
      <Form.Item
        name="title"
        label="标题"
        rules={[{ required: true, message: '请输入标题' }]}
      >
        <Input placeholder="请输入标题" />
      </Form.Item>
      <Form.Item
        name="cover_image"
        label="封面图片"
        valuePropName="cover_image"
        getValueFromEvent={() => coverFileList[0]?.response?.url || ''}
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
        name="content"
        label="正文内容"
        rules={[{ required: true, message: '请输入正文内容' }]}
      >
        <EditorComponent />
      </Form.Item>
      <Form.Item
        name="summary"
        label="摘要"
        rules={[]}
      >
        <Input.TextArea rows={2} placeholder="请输入摘要" />
      </Form.Item>
      <Form.Item
        name="tags"
        label="标签"
      >
        <Select
          mode="multiple"
          placeholder="请选择标签"
          optionFilterProp="children"
        >
          {tags.map(tag => (
            <Option key={tag.id} value={tag.id}>{tag.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="is_published"
        label="发布状态"
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren="已发布" unCheckedChildren="未发布" />
      </Form.Item>
    </>
  );
};

export default BlogForm; 