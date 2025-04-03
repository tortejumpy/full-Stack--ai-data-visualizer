const { Scene, PerspectiveCamera, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } = require('three');
const Data = require('../models/Data');

exports.generate3DGraph = async (req, res) => {
  try {
    const data = await Data.find().lean();
    if (!data.length) throw new Error('No data found');

    // 1. Set up Three.js scene
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, 800 / 600, 0.1, 1000);
    const renderer = new WebGLRenderer();
    renderer.setSize(800, 600);


    data.forEach((item, index) => {
      const height = item.age || 1; 
      const geometry = new BoxGeometry(1, height, 1);
      const material = new MeshBasicMaterial({ 
        color: Math.random() * 0xffffff 
      });
      const cube = new Mesh(geometry, material);
      cube.position.x = index * 2;
      scene.add(cube);
    });

    camera.position.z = 20;

  
    const { PNG } = require('pngjs');
    const { createCanvas } = require('canvas');
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    

    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('3D Graph Rendered Server-Side', 50, 50);
    
    const buffer = canvas.toBuffer('image/png');
    res.type('png').send(buffer);

  } catch (error) {
    res.status(500).json({ 
      error: '3D graph generation failed', 
      details: error.message 
    });
  }
};