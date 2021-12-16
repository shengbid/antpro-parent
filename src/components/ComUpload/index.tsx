import React, { useState, useEffect } from 'react'
import { Button, Upload, message } from 'antd'
import { UploadOutlined, FileTextOutlined, FilePdfOutlined, FileExcelOutlined, FileImageOutlined, FileUnknownOutlined, FileGifOutlined, FileWordOutlined } from '@ant-design/icons'

export type comuploadProps = {
  value?: any
  onChange?: (arr?: any) => void
  limit?: number
  isDetail?: boolean
}

const ComUpload: React.FC<comuploadProps> = ({ value = [], limit = 10, onChange, isDetail = false }) => {
  const [files, setFiles] = useState<any[]>([])
  // console.log(3, value)

  useEffect(() => { // 展示传入的文件数据
    if (value && (value.length || value.fileName) ) { // 文件数值
      const newValues: any[] = []
      if (value && value.length) {
        value.forEach((item: any) => {
          const newItem = item
          if (!item.url) {
            newItem.name = item.fileName
            newItem.url = item.fileUrl
            newItem.uid = item.id ? item.id : Math.floor(Math.random() * 1000)
          }
          newValues.push(newItem)
        })
      } else if (value?.fileName) { // 文件对象
        newValues.push({
          name: value.fileName,
          url: value.fileUrl,
          uid: value.id ? value.id : Math.floor(Math.random() * 1000),
        })
      }
      setFiles(newValues)

    }
  }, [value])

  const action = `/api/upload/file`

  // 文件上传
  const changeFile = ({ file, fileList }: any) => {
    console.log(6, file, fileList)
    if (file.status !== 'uploading') {
      // 需要改变fileList的值,否则status的状态不会改变
      fileList = fileList.map((item: any) => {
        let newItem = {...item}
        if (item.response) {
          newItem = {
            fileName: item.name,
            fileUrl: item.response.data.fileUrl
          }
        }
        return newItem
      })
      onChange?.(fileList)
    }
    setFiles(fileList)
  }

  // 文件名icon
  const fileIcon = new Map([
    ['deflaut', <FileTextOutlined />],
    ['txt', <FileTextOutlined />],
    ['pdf', <FilePdfOutlined />],
    ['doc', <FileWordOutlined />],
    ['docx', <FileWordOutlined />],
    ['xls', <FileExcelOutlined />],
    ['xlsx', <FileExcelOutlined />],
    ['png', <FileImageOutlined />],
    ['jpg', <FileImageOutlined />],
    ['gif', <FileGifOutlined />],
    ['unkown', <FileUnknownOutlined />],
  ])

  const iconRender = (file: any) => {
    const { name } = file
    return fileIcon.get(name ? name.split('.')[1] : 'deflaut') || <FileUnknownOutlined />
  }
  
  const checkFileSize = (file: any) => {
    const size = file.size / 1024 / 1024
    if (size > 10) {
      message.warn('上传文件大小不能超过10M。')
      return Upload.LIST_IGNORE
    }
    return true
  }

  return (
    <Upload
      action={action}
      disabled={isDetail}
      iconRender={iconRender}
      maxCount={limit}
      onChange={changeFile}
      fileList={files}
      beforeUpload={checkFileSize}
    >
      { limit > files.length && !isDetail && limit > value.length ? <Button icon={<UploadOutlined />} type="text" /> : null}
    </Upload>
  )
}

export default ComUpload
