import React from 'react'
import PublishTable from '../../components/publish-manage/PublishTable'

export default function ToReleased() {
  return (
    <div>
      <PublishTable publishState={1} />
    </div>
  )
}

