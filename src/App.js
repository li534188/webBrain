import React, {useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Button, Modal} from 'react-bootstrap'
import {useSelector, useDispatch} from 'react-redux'
import * as actions from './actions/infos'
const THREE = window.THREE = require('three')
require('three/examples/js/loaders/GLTFLoader')
require('three/examples/js/controls/OrbitControls')

require('three/src/math/Vector2')
const {Raycaster}  = require('three/src/core/Raycaster')
function App() {
  
  //数据
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const pageIndex = useSelector(state=> state.global.selectName);
  console.log(pageIndex)
  GetThree();
  return (
    <div className="App">
      {/* 123 */}
      <Button variant="success" onClick={handleShow}>测试</Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );  
}

function GetThree(){
  console.log("执行函数")
  let scene, camera, renderer, mesh;
  let controls;
  let clock ;
  let delta; 
  let gLabel;
  const dispatch = useDispatch();
  let _labelData = [
    {attributes:{x:0,y:90,z:70, textvalue:'视觉联络区'}, name:'vision'},
    {attributes:{x:0,y:110,z:0, textvalue:'主要运动区'}, name:'motion'}, 
    {attributes:{x:80,y:50,z:0, textvalue:'听觉联络区'}, name:'hearing'},  
    {attributes:{x:-5,y:65,z:-80, textvalue:'额叶'}, name:'lobe'},  
    {attributes:{x:25,y:0,z:-5, textvalue:'小脑'}, name:'cerebellum'},                 
                  ];
  let positionInfore = {
    vision:{x:0,y:100,z:200},
    motion:{x:0,y:200,z:100},
    hearing:{x:180,y:100,z:10},
    lobe:{x:0,y:100,z:-200},
    cerebellum:{x:0,y:-60,z:-200},
  }

  const init = ()=>{
    scene = new THREE.Scene();
	  // 精灵文字
	  gLabel = new THREE.Group();
    camera = new THREE.PerspectiveCamera( 80, window.innerWidth/window.innerHeight, 1, 1000 );
    camera.position.set(0, 100, 200);
	
	  renderer = new THREE.WebGLRenderer( {antialias:true, alpha: true } );
	  renderer.setSize( window.innerWidth, window.innerHeight );
	  renderer.setClearAlpha(0.2);
	  document.body.appendChild( renderer.domElement );
	  // renderer.setClearColor(0xb9d3ff, 1); //设置背景颜色
	  let point = new THREE.PointLight(0xf5f5f5);
    
    point.position.set(300, 300, 800); //点光源位置
	  scene.add(point); //点光源添加到场景中
	  let point1 = new THREE.PointLight(0xf5f5f5);
	  point1.position.set(300,300,-800);
    scene.add(point1);
    
	  let point2 = new THREE.PointLight(0xf5f5f5);
	  point2.position.set(-300,150,0);
    scene.add(point2);
    
	  // //环境光
    let ambient = new THREE.AmbientLight(0x444444);
	  scene.add(ambient);
    
    // 文字
	  generateText()
	  scene.add(gLabel);
	  // renderer.render(scene, camera);
	  camera.lookAt(scene.position);
	  controls = new THREE.OrbitControls(camera,renderer.domElement);
	  // controls.addEventListener('change', ()=>{ renderer.render(scene,camera)})
	  controls.autoRotate = false;
	  clock = new THREE.Clock();
    let gltfLoader = new THREE.GLTFLoader();

    gltfLoader.load("brain/scene.gltf", function(materials){
      console.log(materials)
      materials.scene.scale.set(100,100,100)
      scene.add(materials.scene);
      
      renderer.render(scene, camera);
    });

    document.body.appendChild(renderer.domElement);
  }

  const render = ()=>{
    renderer.render(scene, camera);
  }
  
  const animate = () =>{
    delta = clock.getDelta();
    controls.update(delta);
    render()
    requestAnimationFrame(animate);
  }

  const generateText = () =>{
    _labelData.map(item=>{
      let texture = new THREE.CanvasTexture(getCanvasFont(100, 50, item.attributes.textvalue, "#000000", null));
      let material = new THREE.SpriteMaterial({
        map: texture
      });
      let fontMesh = new THREE.Sprite(material)
      let width = material.map.image.width;
      let height = material.map.image.height;
      fontMesh.scale.set(30, 30, 1)
      fontMesh.name=item.name
      console.log(fontMesh)
      // 定义提示文字显示位置
      // let lblPos = {x:item.attributes.x, y:item.attributes.y, z:item.attributes.z};
      fontMesh.position.set(item.attributes.x, item.attributes.y, item.attributes.z );
      gLabel.add(fontMesh);
      console.log(gLabel)
    })
  }

  const getCanvasFont = (w, h, textValue, fontColor) => {
    let canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    let ctx = canvas.getContext('2d');
    // ctx.fillStyle =  '#fff';//textBackground;
    ctx.font = 15 + "px 'Georgia'";
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = "#000000";
    ctx.fillText(textValue, 10, 10 );
    //document.body.appendChild(canvas);
    return canvas;
  }

  //点击事件
  console.log(Raycaster)
  const raycaster = new Raycaster();//光线投射，用于确定鼠标点击位置
  const mouse = new THREE.Vector2();//创建二维平面
  
  //点击方法
  const mousedown = (e) =>{
    console.log(123)
      //将html坐标系转化为webgl坐标系，并确定鼠标点击位置
      mouse.x =  e.clientX / renderer.domElement.clientWidth*2-1;
      mouse.y =  -(e.clientY / renderer.domElement.clientHeight*2)+1;
      
      //以camera为z坐标，确定所点击物体的3D空间位置
      raycaster.setFromCamera(mouse,camera);
      //确定所点击位置上的物体数量
      let intersects = raycaster.intersectObjects(gLabel.children);
      //选中后进行的操作
      if(intersects.length){
        console.log(intersects[0].object.name)
        rorateAndSow(intersects[0].object.name)
      }
  }
  window.addEventListener("click",mousedown);//页面绑定鼠标点击事件

  // 点击后执行的方法
  const rorateAndSow = (name) =>{
    const location = positionInfore[name]
    dispatch(actions.changeType(name))
    camera.position.set(location.x,location.y,location.z)
  }
  init();
  animate();
  
}


function model(){
  return (
    <div></div>
  )
}

export default App;
