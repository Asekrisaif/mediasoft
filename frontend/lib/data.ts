export const products = {
  'new-arrivals': [
    {
      id: 1,
      name: 'Quantum X Pro Gaming Laptop',
      price: 2499.99,
      image: 'https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&q=80&w=1000',
      rating: 4.8,
      reviews: 124,
      specs: {
        processor: 'Neural X9 5.5GHz',
        ram: '32GB DDR5',
        storage: '2TB NVMe SSD',
        gpu: 'RTX 5080 Ti 16GB',
        display: '17" 4K OLED 240Hz',
        battery: '99.9Wh Li-Ion',
        weight: '2.1kg',
        dimensions: '395 x 282 x 20mm',
      },
      stock: 15,
      category: 'Laptops',
    },
    {
      id: 2,
      name: 'HoloLens Pro AR Glasses',
      price: 1299.99,
      image: 'https://images.unsplash.com/photo-1622979135225-d2ba269cf1ac?auto=format&fit=crop&q=80&w=1000',
      rating: 4.9,
      reviews: 89,
      specs: {
        resolution: '8K per eye',
        fov: '150° FOV',
        processor: 'Neural AR Chip',
        battery: '8 hours',
        connectivity: '6G Wireless',
        sensors: 'Eye tracking, hand tracking',
        weight: '120g',
        compatibility: 'Universal',
      },
      stock: 8,
      category: 'AR/VR',
    },
  ],
  'computers': [
    {
      id: 3,
      name: 'Quantum Core Desktop PC',
      price: 3499.99,
      image: 'https://images.unsplash.com/photo-1587202372634-32705e3bf49c?auto=format&fit=crop&q=80&w=1000',
      rating: 4.7,
      reviews: 156,
      specs: {
        processor: 'Quantum i13 6.2GHz',
        ram: '128GB DDR5',
        storage: '4TB NVMe + 10TB SSD',
        gpu: 'RTX 5090 32GB',
        cooling: 'Liquid Nitrogen System',
        power: '1200W Titanium PSU',
        case: 'Tempered Glass RGB',
        os: 'Windows 12 Pro',
      },
      stock: 5,
      category: 'Desktops',
    },
    {
      id: 4,
      name: 'NanoTech Mini PC',
      price: 899.99,
      image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?auto=format&fit=crop&q=80&w=1000',
      rating: 4.9,
      reviews: 78,
      specs: {
        processor: 'M3 Pro',
        ram: '32GB Unified',
        storage: '1TB SSD',
        size: 'Ultra Compact',
        ports: 'Thunderbolt 5',
        connectivity: 'Wi-Fi 7, Bluetooth 6.0',
        power: '65W USB-C',
        dimensions: '12 x 12 x 3.6cm',
      },
      stock: 20,
      category: 'Desktops',
    },
  ],
  'accessories': [
    {
      id: 5,
      name: 'Neural Haptic Controller',
      price: 299.99,
      image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=1000',
      rating: 4.8,
      reviews: 245,
      specs: {
        sensors: 'Neural feedback',
        battery: '100 hours',
        compatibility: 'Universal',
        features: 'Force feedback',
        connectivity: 'Wireless, USB-C',
        weight: '280g',
        buttons: 'Programmable',
        material: 'Premium soft-touch',
      },
      stock: 30,
      category: 'Gaming',
    },
    {
      id: 6,
      name: 'Quantum Mouse Pro',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?auto=format&fit=crop&q=80&w=1000',
      rating: 4.7,
      reviews: 189,
      specs: {
        sensor: '32K DPI Quantum',
        switches: 'Optical 100M',
        rgb: 'Spectrum Sync',
        weight: '65g',
        battery: '240 hours',
        connectivity: 'Wireless, Bluetooth, USB-C',
        buttons: '8 programmable',
        polling: '8000Hz',
      },
      stock: 45,
      category: 'Peripherals',
    },
  ],
  'components': [
    {
      id: 7,
      name: 'Quantum SSD 4TB',
      price: 499.99,
      image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&q=80&w=1000',
      rating: 4.6,
      reviews: 167,
      specs: {
        speed: '12GB/s Read/Write',
        type: 'NVMe Gen5',
        endurance: '10000TBW',
        cache: '8GB DRAM',
        interface: 'PCIe 5.0 x4',
        form: 'M.2 2280',
        encryption: 'Hardware AES-256',
        warranty: '10-year limited',
      },
      stock: 25,
      category: 'Storage',
    },
    {
      id: 8,
      name: 'Neural GPU 32GB',
      price: 1999.99,
      image: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=1000',
      rating: 4.9,
      reviews: 92,
      specs: {
        cores: '24576 CUDA',
        memory: '32GB GDDR7',
        clock: '3.2GHz Boost',
        power: '450W TDP',
        cooling: 'Triple Fan Vapor Chamber',
        ports: '3x DisplayPort 2.1, HDMI 3.0',
        architecture: 'Quantum Lake',
        raytracing: 'Neural RT Cores',
      },
      stock: 3,
      category: 'GPUs',
    },
  ],
  'smart-home': [
    {
      id: 9,
      name: 'HoloScreen 8K 85"',
      price: 4999.99,
      image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?auto=format&fit=crop&q=80&w=1000',
      rating: 4.8,
      reviews: 45,
      specs: {
        resolution: '8K Quantum HDR',
        refresh: '240Hz Native',
        hdr: 'Infinite Contrast',
        sound: '7.1.4 Spatial',
        processor: 'Neural Vision Engine',
        connectivity: 'HDMI 3.0, Wi-Fi 7',
        features: 'AI upscaling, Ambient mode',
        smart: 'Voice control, gesture recognition',
      },
      stock: 7,
      category: 'TVs',
    },
    {
      id: 10,
      name: 'Neural Hub Pro',
      price: 399.99,
      image: 'https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&q=80&w=1000',
      rating: 4.7,
      reviews: 156,
      specs: {
        ai: 'Neural Processor',
        compatibility: 'Universal IoT',
        security: 'Quantum Encryption',
        connectivity: 'Wi-Fi 7',
        voice: 'Multi-assistant support',
        automation: 'Advanced scene recognition',
        power: 'USB-C, battery backup',
        sensors: 'Temperature, humidity, motion',
      },
      stock: 18,
      category: 'Smart Home',
    },
  ],
}

export const categoryTitles = {
  'new-arrivals': 'Latest Tech',
  'computers': 'Computers & Workstations',
  'accessories': 'Gaming & Accessories',
  'components': 'PC Components',
  'smart-home': 'Smart Home',
}