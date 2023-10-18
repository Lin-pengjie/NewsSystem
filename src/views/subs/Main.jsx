import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Drawer, Image, Row } from 'antd';
import { PieChartOutlined } from '@ant-design/icons';
import MainList from '../../components/Main-List/MainList'
import * as echarts from 'echarts'
import axios from 'axios';
import _ from 'lodash'; // 引入lodash库

export default function Main() {
  const BarChartRef = useRef()
  const FanDiagramRef = useRef()
  const [allList, setallList] = useState([])
  const [open, setOpen] = useState(false)
  const [FanDiagramChar, setFanDiagramChar] = useState(null)
  const User = JSON.parse(localStorage.getItem('token'))

  useEffect(() => {
    axios("/news?publishState=2&_expand=category").then(res => {
      views(_.groupBy(res.data, item => item.category.title))
      setallList(res.data)
    })
    return () => {
      window.onresize = null
    }
  }, [])

  const FanDiagramViews = () => {
    var userList = allList.filter(item => item.author === User.username)
    var obj = _.groupBy(userList, item => item.category.title)
    var list =[]
    for(var i in obj){
      list.push({
        name:i,
        value:obj[i].length
      })
    }
    let myChart;
    if (!FanDiagramChar) {
      myChart = echarts.init(FanDiagramRef.current);
      setFanDiagramChar(myChart);
    } else {
      myChart = FanDiagramChar;
    }
    var option;

    option = {
      tooltip: {
        trigger: 'item'
      },
      legend: {
        top: '5%',
        left: 'center'
      },
      series: [
        {
          name: '发布数量',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 40,
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data:list
        }
      ]
    };

    option && myChart.setOption(option);
  }

  const views = (data) => {
    var myChart = echarts.init(BarChartRef.current);
    // 绘制图表
    myChart.setOption({
      title: {
        text: '新闻分类图示'
      },
      tooltip: {},
      xAxis: {
        data: Object.keys(data),
        axisLabel: {
          rotate: 45
        }
      },
      yAxis: {
        minInterval: 1
      },
      series: [
        {
          name: '数量',
          type: 'bar',
          data: Object.values(data).map(item => item.length)
        }
      ]
    })
    window.onresize = () => {
      myChart.resize()
    }
  }

  return (
    <>
      <Row gutter={16}>
        <Col span={8}>
          <Card title="游览最多" bordered={true}>
            <MainList data='view'></MainList>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="点赞最多" bordered={true}>
            <MainList data='star'></MainList>
          </Card>
        </Col>
        <Col span={8}>
          <Card bordered={true}>
            <div>
              <Image
                src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
              />
            </div>
            <div>
              {/* 这里是你想要放置的内容 */}
            </div>
            <div style={{ display: 'flex' }}>
              <Button icon={<PieChartOutlined />} style={{ flex: '1' }} onClick={() => {
                setOpen(true)
                let aa = setInterval(() => {
                  FanDiagramViews()
                  clearInterval(aa)
                }, 0)
              }} />
            </div>
          </Card>
        </Col>
      </Row>
      <Drawer title="个人新闻分类" placement="right" onClose={() => setOpen(false)} open={open} width='70vh'>
        <div ref={FanDiagramRef} style={{ width: '100%', height: '400px' }} />
      </Drawer>
      <div ref={BarChartRef} style={{
        width: '100%',
        height: "400px",
        marginTop: "30px"
      }}></div>
    </>
  )
}