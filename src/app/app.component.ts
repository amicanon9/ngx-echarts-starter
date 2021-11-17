import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MockServerService } from './mock-server.service';
import * as echarts from 'echarts';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit{
  siteinfo:any=[];
  point: any = [];
  regionOptions;
  options = {
    xAxis: {
      type: 'category',
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
      },
    ],
  };

  mergeOption: any;
  loading = false;

  constructor(private api: MockServerService, private http: HttpClient)
  {
    this.http.get('assets/output.json').subscribe((x:any) => {
      x.forEach(e => {
        let b={
          name: e.company_name,
          value: [e.longitude, e.latitude, e.avg_kwp],
        }
        if (parseFloat(b.value[2]) > 3.75) {
          this.point.push(b)
        } else {
          this.siteinfo.push(b)
        }
      });
      console.log(this.point,this.siteinfo)
      this.initchart()
    })
  }
  ngOnInit(){

  }
  initchart(){
    this.http.get('assets/twCounty2010.geo5.json').subscribe((geoJson: any) => {
      echarts.registerMap('taiwan', geoJson);
      this.regionOptions = {
        tooltip: {
          trigger: 'item',
        },
        toolbox: {
          show: true,
          orient: 'vertical',
          left: 'right',
          top: 'center',
          feature: {
            dataView: { readOnly: false },
            restore: {},
            saveAsImage: {}
          }
        },
        visualMap: {
          min: 1,
          max: 4,
          text: ['High', 'Low'],
          realtime: false,
          calculable: true,
          inRange: {
            color: ['#33ccff', '#ffff00']
          }
        },
        geo:{
          map: 'taiwan',
          roam: true,
          itemStyle: {
            normal: {
              areaColor: 'rgba(102, 204, 255,0.5)',
              borderColor: 'white',
              label: { show: true, color: 'white' }
            },
            emphasis: {
              areaColor: '#A5DABB'
            }
          },
          zoom: 1.5,
        },
        series: [
          {
            name: '日照能量',
            type: 'scatter',
            coordinateSystem: 'geo',
            encode: {
              value: 2
            },
            data: this.siteinfo,
            symbolSize: (value, params) => {
              return parseFloat(params.data.value[2]) * 3
            },
          },
          {
            name: 'TOP',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            encode: {
              value: 2
            },
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke'
            },
            itemStyle: {
              shadowBlur: 1,
              shadowColor: '#333'
            },
            emphasis: {
              scale: true
            },
            zlevel:1,
            data: this.point,
            symbolSize: 15
          }
        ]
      };
    })
  }
  getData() {
    this.loading = true;
    this.api
      .getData()
      .then((data) => {
        this.mergeOption = { series: [{ data }] };
      })
      .catch((e) => {
        /** Error Handler */
      })
      .then(() => {
        this.loading = false;
      });
  }
}
     // {
          //   type: 'map',
          //   mapType: 'taiwan',
          //   roam: true,
          //   itemStyle: {
          //     normal: {
          //       areaColor: '#c6ecc6',
          //       borderColor: 'white',
          //       label: { show: true, color: 'white' }
          //     },
          //     emphasis: {
          //       areaColor: '#A5DABB'
          //     }
          //   },
          //   zoom: 1.5,
          //   data: [
          //     { name: '嘉義縣', value: 4967.69 },
          //     { name: '彰化縣', value: 3920.09 },
          //     { name: '高雄市', value: 1830.62 },
          //     { name: '台北市', value: 4100.63 },
          //     { name: '花蓮縣', value: 100.41 },
          //     { name: '台中市', value: 220.5837 }

          //   ],
          //   markPoint: {
          //     symbol: 'circle',
          //     symbolSize:(value,params)=>{
          //       return parseFloat(params.data.value)*3
          //     },
          //     label:{
          //       show:false
          //     },
          //     large: true,
          //     itemStyle:{

          //     },
          //     effect: {
          //       show: true,
          //       shadowBlur: 0
          //     },
          //     data:this.siteinfo,
          //   },
          // },
          // {
          //   name: 'Top 5',
          //   type: 'effectScatter',
          //   coordinateSystem: 'geo',
          //   data:this.point,
          //   symbolSize: 5,
          //   encode: {
          //     value: 2
          //   },
          //   showEffectOn: 'render',
          //   rippleEffect: {
          //     brushType: 'stroke'
          //   },
          //   itemStyle: {
          //     shadowBlur: 10,
          //     shadowColor: '#333'
          //   },
          // }
