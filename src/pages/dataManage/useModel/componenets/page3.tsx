import { useModel } from 'umi';
import { Descriptions } from 'antd';

export default () => {
  const { count } = useModel('product', model => (
    { 
      count: model.count
    }
  ))

  return <>
    <h2>页面三</h2>
    <Descriptions title="商品信息">
      <Descriptions.Item label="名称">T-shirt</Descriptions.Item>
      <Descriptions.Item label="价格">799</Descriptions.Item>
      <Descriptions.Item label="数量">{count}</Descriptions.Item>
    </Descriptions>
  </>
};