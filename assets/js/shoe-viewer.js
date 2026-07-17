const status = document.querySelector("#modelStatus");
    const canvas = document.querySelector("#shoeCanvas");
    const modal = document.querySelector("#viewerModal");
    const closeButton = document.querySelector("#viewerClose");
    const title = document.querySelector("#viewerTitle");
    const description = document.querySelector("#viewerDescription");
    const meta = document.querySelector("#viewerMeta");
    const brandThemes = {
      Nike: { upper: 0xffffff, sole: 0x111111, accent: 0x0e8f7d },
      Adidas: { upper: 0xf3f0e8, sole: 0x191919, accent: 0xefb64f },
      Puma: { upper: 0x111111, sole: 0xf8f6ef, accent: 0xd95f2d },
      "New Balance": { upper: 0xd8d2c6, sole: 0xffffff, accent: 0xb23b3b },
      Salomon: { upper: 0x31453d, sole: 0x151515, accent: 0x83c5be }
    };

    try {
      const THREE = await import("https://unpkg.com/three@0.165.0/build/three.module.js");
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
      const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
      const light = new THREE.DirectionalLight(0xffffff, 2.4);
      const fill = new THREE.HemisphereLight(0xffffff, 0x20332f, 1.9);
      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(3.6, 96),
        new THREE.MeshStandardMaterial({ color: 0x0f1715, roughness: 0.7, metalness: 0.05 })
      );
      let shoe;
      let targetRotation = 0;

      camera.position.set(0, 1.6, 6.7);
      light.position.set(3, 4, 3);
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -0.82;
      scene.add(light, fill, floor);

      function roundedBox(width, height, depth, color, x, y, z) {
        const mesh = new THREE.Mesh(
          new THREE.BoxGeometry(width, height, depth, 4, 2, 2),
          new THREE.MeshStandardMaterial({ color, roughness: 0.52, metalness: 0.04 })
        );
        mesh.position.set(x, y, z);
        return mesh;
      }

      function cylinder(radius, depth, color, x, y, z, rx, rz) {
        const mesh = new THREE.Mesh(
          new THREE.CylinderGeometry(radius, radius, depth, 18),
          new THREE.MeshStandardMaterial({ color, roughness: 0.5 })
        );
        mesh.position.set(x, y, z);
        mesh.rotation.x = rx;
        mesh.rotation.z = rz;
        return mesh;
      }

      function buildShoe(theme, product) {
        if (shoe) scene.remove(shoe);
        shoe = new THREE.Group();

        const trailLift = product.style === "Trail" ? 0.15 : 0;
        const sole = roundedBox(4.05, 0.38 + trailLift, 1.26, theme.sole, 0, -0.36, 0);
        const midsole = roundedBox(3.82, 0.26, 1.1, 0xf7f1e7, 0.04, -0.1 + trailLift * 0.35, 0);
        const upper = roundedBox(2.64, product.style === "Running" ? 0.64 : 0.72, 0.98, theme.upper, -0.34, 0.34, 0);
        const toe = new THREE.Mesh(
          new THREE.SphereGeometry(0.74, 32, 18),
          new THREE.MeshStandardMaterial({ color: theme.upper, roughness: 0.5 })
        );
        const heel = roundedBox(0.7, 0.92, 0.98, theme.upper, -1.62, 0.45, 0);
        const tongue = roundedBox(0.92, 0.18, 0.58, theme.accent, 0.34, 0.86, 0);
        const collar = cylinder(0.42, 1.02, theme.accent, -1.22, 0.96, 0, Math.PI / 2, 0);

        toe.scale.set(product.style === "Lifestyle" ? 1.46 : 1.34, 0.58, 0.82);
        toe.position.set(1.28, 0.2, 0);
        tongue.rotation.z = -0.36;

        shoe.add(sole, midsole, upper, toe, heel, tongue, collar);

        for (let i = 0; i < 5; i += 1) {
          const lace = cylinder(0.025, 0.82, 0x151515, 0.06 + i * 0.22, 0.78 - i * 0.035, 0, Math.PI / 2, 0.92);
          shoe.add(lace);
        }

        for (let i = 0; i < 9; i += 1) {
          const gripHeight = product.style === "Trail" ? 0.12 : 0.06;
          const grip = roundedBox(0.2, gripHeight, 0.95, theme.accent, -1.7 + i * 0.42, -0.62 - trailLift * 0.35, 0);
          shoe.add(grip);
        }

        shoe.rotation.set(-0.12, -0.55, 0.05);
        scene.add(shoe);
      }

      function resize() {
        const rect = canvas.parentElement.getBoundingClientRect();
        const width = Math.max(320, rect.width);
        const height = Math.max(360, rect.height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }

      function openViewer(product) {
        const theme = brandThemes[product.brand] || brandThemes.Nike;
        title.textContent = product.name;
        description.textContent = "Mueve el mouse sobre el modelo o deja que rote automaticamente para ver la zapatilla en 360 grados.";
        meta.innerHTML = `
          <span>${product.brand}</span>
          <span>${product.style}</span>
          <span>EU ${product.sizes[0]}-${product.sizes[product.sizes.length - 1]}</span>
          <span>${product.price} EUR</span>
        `;
        modal.hidden = false;
        document.body.style.overflow = "hidden";
        buildShoe(theme, product);
        resize();
        status.textContent = "360 activo";
      }

      function closeViewer() {
        modal.hidden = true;
        document.body.style.overflow = "";
      }

      canvas.addEventListener("pointermove", (event) => {
        const rect = canvas.getBoundingClientRect();
        targetRotation = ((event.clientX - rect.left) / rect.width - 0.5) * 2.2;
      });

      closeButton.addEventListener("click", closeViewer);
      modal.addEventListener("click", (event) => {
        if (event.target === modal) closeViewer();
      });
      window.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) closeViewer();
      });
      window.addEventListener("resize", resize);
      document.addEventListener("openShoe360", (event) => openViewer(event.detail));

      function animate() {
        if (shoe && !modal.hidden) {
          shoe.rotation.y += (targetRotation - shoe.rotation.y + Math.sin(performance.now() * 0.00045) * 0.6) * 0.035;
          shoe.rotation.x = -0.12 + Math.sin(performance.now() * 0.00075) * 0.025;
        }
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }

      animate();
      status.textContent = "360 listo";
    } catch (error) {
      status.textContent = "Vista 360 no disponible sin conexion.";
    }

