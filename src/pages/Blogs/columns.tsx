import { TableColumn, BlogData, TagData } from '../../types';
import { Tag, Space, Image } from 'antd';
import { tagColor } from '../../constants';
import { ActionButtons } from '../../components';

interface BlogColumnsProps {
  hasPermission: (key: string) => boolean;
  handleEdit: (record: BlogData) => void;
  handleDelete: (record: BlogData) => void;
}

export function getBlogColumns({
  hasPermission,
  handleEdit,
  handleDelete,
}: BlogColumnsProps): TableColumn[] {
  return [
    { title: 'ID', dataIndex: 'id', width: 80 },
    { title: '标题', dataIndex: 'title', width: 100 },
    {
      title: '封面图片',
      dataIndex: 'cover_image',
      width: 100,
      render: (v: string) =>
        v && (
          <Image src={process.env.REACT_APP_IMAGE_BASE_URL + v} alt={v} style={{ width: '100%' }} />
        ),
    },
    {
      title: '标签',
      dataIndex: 'tags',
      width: 180,
      render: (tags: TagData[]) => (
        <Space>
          {tags?.map((tag, index) => (
            <Tag key={tag.id} style={{ color: tagColor[index] }}>
              {tag.name}
            </Tag>
          )) || '-'}
        </Space>
      ),
    },
    { title: '作者', dataIndex: 'author_id', width: 100 },
    {
      title: '发布状态',
      dataIndex: 'is_published',
      width: 100,
      render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? '已发布' : '未发布'}</Tag>,
    },
    {
      title: '精选状态',
      dataIndex: 'is_choice',
      width: 100,
      render: (v: boolean) => <Tag color={v ? 'green' : 'red'}>{v ? '已精选' : '未精选'}</Tag>,
    },
    { title: '阅读量', dataIndex: 'views', width: 100 },
    { title: '点赞数', dataIndex: 'likes', width: 100 },
    { title: '评论数', dataIndex: 'comments_count', width: 100 },
    {
      title: '需要时间',
      dataIndex: 'need_time',
      width: 100,
      render: (v: number) => (v ? `${v} 分钟` : ''),
    },
    {
      title: '操作',
      key: 'action',
      dataIndex: 'operation',
      width: 150,
      fixed: 'right',
      render: (_: any, record: BlogData) => (
        <ActionButtons
          record={record}
          onEdit={handleEdit}
          onDelete={handleDelete}
          editDisabled={!hasPermission('update')}
          deleteDisabled={!hasPermission('delete')}
        />
      ),
    },
  ];
}
