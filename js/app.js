/* ================================================================
   善化寺数字博物馆 — app.js
   核心逻辑：Landing → VR、Pannellum、探索任务、AI导游、时间轴
   ================================================================ */

// ---- 配置数据 ----
const CONFIG = {
  panorama: {
    // 替换为你的全景图路径（equirectangular）
    source: 'panorama/shanhua_main.jpg',
    type: 'equirectangular',
    autoLoad: true,
    autoRotate: -1,
    compass: false,
    showControls: false,
    mouseZoom: true,
    hfov: 110,
    minHfov: 60,
    maxHfov: 140,
    pitch: 0,
    yaw: 0,
    haov: 360,
    vaov: 180,
  },
  // 热点位置（基于全景图实际方位调整）
  hotspots: [
    { id: 'buddha',  yaw: -55,  pitch: -8,   label: '五方佛',  era: 'liao' },
    { id: 'caisson', yaw: 5,    pitch: 55,   label: '藻井',    era: 'liao' },
    { id: 'mural',   yaw: 85,   pitch: 2,    label: '壁画',    era: 'qing' },
    { id: 'dougong', yaw: -25,  pitch: 32,   label: '斗拱',    era: 'liao' },
  ],
  scores: {
    buddha:  30,
    caisson: 25,
    mural:   20,
    dougong: 25,
  },
};

// ---- 文物数据 ----
const ARTIFACTS = {
  buddha: {
    title: '五方佛',
    era: '辽代',
    desc: '大雄宝殿内供奉的五尊彩塑佛像，为辽代原作，神态端庄，衣纹流畅，是中国现存最精美的辽代彩塑之一。',
    story: '善化寺大雄宝殿的五方佛，分别是东方阿閦佛、南方宝生佛、中央毗卢遮那佛、西方阿弥陀佛和北方不空成就佛。每尊佛像高约2.5米，面容丰满，神态安详。这些彩塑历经千年仍保存完好，展现了辽代工匠超凡的雕塑技艺。佛身原有的贴金彩绘虽已斑驳，却更添一份历史的厚重与庄严。',
    image: 'assets/buddha.jpg',
  },
  caisson: {
    title: '藻井',
    era: '辽代',
    desc: '殿内穹顶藻井以层层斗拱叠涩而成，呈天宫楼阁之形，精妙绝伦，堪称建筑艺术的巅峰之作。',
    story: '藻井是中国古建筑中最精美的室内装饰之一。善化寺大雄宝殿的藻井，不用一钉一铆，全靠斗拱层层叠涩支撑，形成向内收敛的穹顶空间。其结构之精巧、造型之华美，被建筑学家誉为"天宫楼阁"。仰望藻井，层层斗拱如莲花绽放，仿佛通向佛国净土的门户。',
    image: 'assets/caisson.jpg',
  },
  mural: {
    title: '壁画',
    era: '清代',
    desc: '殿内两壁绘有佛教故事壁画，虽为清代重绘，但色彩鲜艳、构图宏大，展现了佛教艺术的深厚底蕴。',
    story: '善化寺壁画虽为清代重绘，但延续了辽金时期的构图传统。画面描绘了佛陀说法、菩萨听经等场景，人物众多而不杂乱，线条流畅，色彩以朱红、石青、石绿为主，历经数百年仍鲜艳如新。壁画中的人物神态各异，从庄严的佛陀到活泼的飞天，展现了不同层次的佛教世界观。',
    image: 'assets/mural.jpg',
  },
  dougong: {
    title: '斗拱',
    era: '辽代',
    desc: '善化寺大雄宝殿的斗拱为辽代原构，体量宏大、造型雄浑，是中国现存最大的辽金木构建筑遗存之一。',
    story: '斗拱是中国古建筑的灵魂构件，起到承托屋檐、传递荷载的关键作用。善化寺大雄宝殿的斗拱，出跳深远、用材粗壮，充分体现了辽代建筑"以大为美"的审美特征。与宋代《营造法式》所载的标准做法相比，善化寺的斗拱更具北方粗犷之美，是中国建筑史上从唐风向宋韵过渡的珍贵实证。',
    image: 'assets/dougong.jpg',
  },
};

// ---- AI 导游对话库 ----
const GUIDE_DIALOGUES = {
  welcome: [
    '欢迎来到善化寺数字博物馆。',
    '我是您的 AI 导览员。这座始建于唐代的古刹，已走过千年风雨。',
    '请跟随我的指引，探索辽金建筑的巅峰之作。您可以环顾四周，点击金色光点开始探索之旅。',
  ],
  buddha: [
    '您发现了五方佛！这是大雄宝殿的镇殿之宝。',
    '五尊佛像分别代表五个方位的佛国世界，中央的毗卢遮那佛是法身佛，象征宇宙本体。',
    '注意观察佛像的面部——辽代工匠塑造的面容丰满圆润，带有明显的契丹民族特征。',
  ],
  caisson: [
    '藻井是古建筑的精华所在！请抬头仰望——',
    '层层斗拱如同花瓣般绽放，这种结构被称为"天宫楼阁"。',
    '不用一根铁钉，全靠榫卯咬合，历经千年依然稳固。这是辽代匠人智慧的结晶。',
  ],
  mural: [
    '这些壁画虽为清代重绘，但保留了辽金时期的构图风格。',
    '画面中描绘了佛陀说法的盛大场景——菩萨、罗汉、飞天环绕四周。',
    '仔细观察色彩的运用：石青与朱红的搭配，是中国传统壁画的经典配色。',
  ],
  dougong: [
    '您看到了斗拱！这是中国古建筑最具标志性的构件。',
    '善化寺的斗拱体量之大，在现存辽金建筑中首屈一指。',
    '它不仅是结构件，更是等级的象征——出跳越多，建筑等级越高。大雄宝殿的斗拱出跳深远，彰显了这座皇家寺院的不凡地位。',
  ],
  fallback: [
    '这是一个很好的问题。善化寺始建于唐开元年间，现存主要建筑为辽金时期所建。',
    '大雄宝殿是善化寺的核心建筑，也是现存最大的辽代木构建筑之一。殿内保存有精美的彩塑、壁画和藻井。',
    '善化寺是中国现存规模最大、保存最完整的辽金寺院之一，被誉为"辽金艺术的宝库"。',
  ],
  complete: [
    '恭喜您完成了所有探索任务！',
    '您已经深入了解了善化寺的四大国宝：五方佛、藻井、壁画和斗拱。',
    '千年古刹，一眼万年。感谢您对这座千年古建的关注与探索。',
  ],
};

// ================================================================
// App 主类
// ================================================================
class ShanHuaApp {
  constructor() {
    this.state = {
      cultureScore: 0,
      completedTasks: [],
      totalTasks: 4,
      currentEra: 'liao',
      isMuseumOpen: false,
      soundEnabled: false,
    };

    this.viewer = null;
    this.guideTyping = false;
    this.ambientAudio = null;

    this.init();
  }

  // ---- 初始化 ----
  init() {
    this.createParticles();
    this.setupUI();
    this.setupAmbientSound();

    // 监听键盘 Enter 发送消息
    const input = document.getElementById('guide-input');
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && input.value.trim()) {
        this.handleUserQuestion(input.value.trim());
        input.value = '';
      }
    });
  }

  // ---- 初始化环境音效 ----
  setupAmbientSound() {
    this.ambientAudio = new Audio('assets/temple_ambient.wav');
    this.ambientAudio.loop = true;
    this.ambientAudio.volume = 0.4;
  }

  // ---- 切换环境音效 ----
  toggleAmbientSound() {
    this.state.soundEnabled = !this.state.soundEnabled;
    
    if (this.state.soundEnabled) {
      this.ambientAudio.play().catch(err => {
        console.warn('Audio play failed:', err);
        this.state.soundEnabled = false;
      });
    } else {
      this.ambientAudio.pause();
      this.ambientAudio.currentTime = 0;
    }
  }

  // ================================================================
  // Landing Page
  // ================================================================

  createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    for (let i = 0; i < 30; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.style.left = Math.random() * 100 + '%';
      p.style.top = (60 + Math.random() * 40) + '%';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.animationDuration = (6 + Math.random() * 6) + 's';
      p.style.width = (2 + Math.random() * 2) + 'px';
      p.style.height = p.style.width;
      container.appendChild(p);
    }
  }

  enterMuseum() {
    const landing = document.getElementById('landing-page');
    const museum = document.getElementById('museum-page');

    landing.classList.add('leaving');

    setTimeout(() => {
      landing.classList.add('hidden');
      museum.classList.remove('hidden');
      this.state.isMuseumOpen = true;
      this.initPanorama();
    }, 800);
  }

  // ================================================================
  // Pannellum
  // ================================================================

  initPanorama() {
    // 构建热点配置（使用自定义 createTooltipFunc）
    const hotspots = CONFIG.hotspots.map(h => ({
      pitch: h.pitch,
      yaw: h.yaw,
      type: 'info',
      cssClass: 'custom-hotspot',
      createTooltipFunc: (hotspotDiv, args) => {
        this.createCustomHotspot(hotspotDiv, args);
      },
      createTooltipArgs: { id: h.id, label: h.label },
      clickHandlerFunc: () => {
        this.onHotspotClick(h.id);
      },
      clickHandlerArgs: {},
    }));

    // Pannellum 配置（移除无效参数）
    const pConfig = {
      type: 'equirectangular',
      panorama: CONFIG.panorama.source,
      autoLoad: true,
      autoRotate: -1,
      compass: false,
      hfov: 110,
      minHfov: 60,
      maxHfov: 140,
      pitch: 0,
      yaw: 0,
      haov: 360,
      vaov: 180,
      hotSpots: hotspots,
    };

    try {
      this.viewer = pannellum.viewer('panorama', pConfig);
    } catch (e) {
      // 全景图未加载时优雅降级
      console.warn('Pannellum 初始化提示：', e.message);
      const panorama = document.getElementById('panorama');
      panorama.style.background = 'radial-gradient(ellipse at center, #1a2035, #0a0e1a)';
      panorama.style.display = 'flex';
      panorama.style.alignItems = 'center';
      panorama.style.justifyContent = 'center';
      panorama.innerHTML = '<div style="text-align:center;color:var(--text-tertiary);"><p style="font-family:var(--font-serif);font-size:1.2rem;margin-bottom:8px;">全景图就绪</p><p style="font-size:0.8rem;">将全景图放入 panorama/shanhua_main.jpg 即可启用</p></div>';
    }
  }

  // ================================================================
  // 自定义热点
  // ================================================================

  createCustomHotspot(hotspotDiv, args) {
    // 金色发光圆点
    const inner = document.createElement('div');
    inner.className = 'custom-hotspot-inner';
    hotspotDiv.appendChild(inner);

    // 悬浮标签
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-hotspot-tooltip';
    tooltip.textContent = args.label;
    hotspotDiv.appendChild(tooltip);

    // 隐藏 Pannellum 默认 tooltip
    hotspotDiv.style.position = 'relative';
  }

  onHotspotClick(artifactId) {
    // 完成探索任务
    if (!this.state.completedTasks.includes(artifactId)) {
      this.completeTask(artifactId);
    }

    // 显示文物卡片
    this.showArtifactCard(artifactId);

    // AI 导游解说
    const dialogues = GUIDE_DIALOGUES[artifactId] || GUIDE_DIALOGUES.fallback;
    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();
      dialogues.forEach((text, i) => {
        setTimeout(() => this.addGuideMessage(text), i * 800);
      });
    }, 1200);
  }

  // ================================================================
  // 探索任务系统
  // ================================================================

  completeTask(taskId) {
    if (this.state.completedTasks.includes(taskId)) return;

    this.state.completedTasks.push(taskId);

    // 更新 UI
    const taskEl = document.querySelector(`.task-item[data-task="${taskId}"]`);
    if (taskEl) {
      taskEl.classList.add('completed', 'just-completed');
      setTimeout(() => taskEl.classList.remove('just-completed'), 1500);
    }

    // 增加文化值
    const score = CONFIG.scores[taskId] || 10;
    this.state.cultureScore += score;

    const scoreEl = document.getElementById('culture-value');
    const scoreParent = scoreEl.closest('.culture-score');
    scoreEl.textContent = this.state.cultureScore;
    scoreParent.classList.add('score-updated');
    setTimeout(() => scoreParent.classList.remove('score-updated'), 600);

    // 更新进度
    this.updateProgress();

    // 全部完成时播放祝贺
    if (this.state.completedTasks.length === this.state.totalTasks) {
      setTimeout(() => {
        GUIDE_DIALOGUES.complete.forEach((text, i) => {
          setTimeout(() => this.addGuideMessage(text), i * 1000);
        });
      }, 2000);
    }
  }

  updateProgress() {
    const count = this.state.completedTasks.length;
    const total = this.state.totalTasks;
    const pct = (count / total) * 100;

    const fill = document.getElementById('progress-fill');
    const text = document.getElementById('progress-text');
    const badge = document.getElementById('task-badge');

    fill.style.width = pct + '%';
    fill.classList.add('shimmer');
    setTimeout(() => fill.classList.remove('shimmer'), 2000);

    text.textContent = `${count} / ${total}`;
    const remaining = total - count;
    badge.textContent = remaining > 0 ? `${remaining} 项待发现` : '全部完成 ✓';
  }

  // ================================================================
  // 文物卡片
  // ================================================================

  showArtifactCard(artifactId) {
    const data = ARTIFACTS[artifactId];
    if (!data) return;

    const card = document.getElementById('artifact-card');
    document.getElementById('artifact-title').textContent = data.title;
    document.getElementById('artifact-era').textContent = data.era;
    document.getElementById('artifact-desc').textContent = data.desc;

    const imgEl = document.getElementById('artifact-image');
    imgEl.style.backgroundImage = `url(${data.image})`;

    const storyEl = document.getElementById('artifact-story');
    storyEl.textContent = data.story;
    storyEl.classList.add('hidden');

    card.classList.remove('hidden');
  }

  hideArtifactCard() {
    document.getElementById('artifact-card').classList.add('hidden');
  }

  // ================================================================
  // AI 导游
  // ================================================================

  addGuideMessage(text, isUser = false) {
    const container = document.getElementById('guide-messages');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-msg' : 'guide-msg'}`;

    const p = document.createElement('p');
    msgDiv.appendChild(p);
    container.appendChild(msgDiv);

    if (isUser) {
      p.textContent = text;
    } else {
      // 打字机效果
      this.typeWriter(p, text);
    }

    // 自动滚动到底部
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 50);
  }

  typeWriter(element, text, callback) {
    if (this.guideTyping) {
      // 如果正在打字，直接显示
      element.textContent = text;
      if (callback) callback();
      return;
    }

    this.guideTyping = true;
    let i = 0;
    const speed = 35; // ms per character

    const type = () => {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(type, speed);
      } else {
        this.guideTyping = false;
        if (callback) callback();
      }
    };
    type();
  }

  showTypingIndicator() {
    const container = document.getElementById('guide-messages');
    const indicator = document.createElement('div');
    indicator.className = 'typing-indicator';
    indicator.id = 'typing-indicator';
    indicator.innerHTML = `
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
      <div class="typing-dot"></div>
    `;
    container.appendChild(indicator);
    container.scrollTop = container.scrollHeight;
  }

  removeTypingIndicator() {
    const indicator = document.getElementById('typing-indicator');
    if (indicator) indicator.remove();
  }

  handleUserQuestion(question) {
    // 显示用户消息
    this.addGuideMessage(question, true);

    // 模拟 AI 回复
    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();

      // 关键词匹配
      const q = question.toLowerCase();
      let responseKey = 'fallback';

      if (q.includes('佛') || q.includes('塑') || q.includes('像')) {
        responseKey = 'buddha';
      } else if (q.includes('藻井') || q.includes('天花') || q.includes('穹顶')) {
        responseKey = 'caisson';
      } else if (q.includes('壁画') || q.includes('画') || q.includes('彩绘')) {
        responseKey = 'mural';
      } else if (q.includes('斗拱') || q.includes('建筑') || q.includes('木构')) {
        responseKey = 'dougong';
      }

      const dialogues = GUIDE_DIALOGUES[responseKey];
      const reply = dialogues[Math.floor(Math.random() * dialogues.length)];
      this.addGuideMessage(reply);
    }, 1500);
  }

  // ================================================================
  // 时间轴
  // ================================================================

  switchEra(era) {
    if (this.state.currentEra === era) return;

    const eraNames = {
      tang:  '唐代',
      liao:  '辽代',
      jin:   '金代',
      ming:  '明代',
      qing:  '清代',
      today: '当代',
    };
    const eraDescs = {
      tang:  '善化寺始建于唐开元年间（713年），初名开元寺，是当时大同地区重要的皇家寺院。',
      liao:  '辽代是善化寺的鼎盛时期。大雄宝殿即为辽代原构，体量宏大，体现了契丹民族雄浑的建筑风格。',
      jin:   '金代对善化寺进行了大规模修缮，现存的文殊阁等建筑即为金代所建。金代建筑在辽代基础上融入了更多精细的装饰。',
      ming:  '明代善化寺经历了多次修缮，寺院格局基本保持了辽金时期的原貌。明代更注重对寺院的维护与保护。',
      qing:  '清代对善化寺进行了彩绘壁画的重新绘制，殿内壁画虽为清代作品，但延续了辽金时期的构图传统。',
      today: '2026年的今天，善化寺作为全国重点文物保护单位，正通过数字化技术让更多人领略千年古建的魅力。',
    };

    // 更新 UI 激活状态
    document.querySelectorAll('.timeline-node').forEach(node => {
      node.classList.remove('active', 'just-activated');
      if (node.dataset.era === era) {
        node.classList.add('active', 'just-activated');
        setTimeout(() => node.classList.remove('just-activated'), 800);
      }
    });

    // 切换时代滤镜（通过 CSS class 在 museum-page 上切换）
    const museumPage = document.getElementById('museum-page');
    museumPage.className = `museum-page era-${era}`;

    // 显示时代浮层标签
    const overlay = document.getElementById('era-overlay');
    if (overlay) {
      overlay.textContent = `${eraNames[era]} · ${era === 'today' ? '2026' : ''}`;
      overlay.classList.add('visible');
      clearTimeout(this._eraOverlayTimer);
      this._eraOverlayTimer = setTimeout(() => {
        overlay.classList.remove('visible');
      }, 3000);
    }

    this.state.currentEra = era;

    // AI 导游提示
    this.showTypingIndicator();
    setTimeout(() => {
      this.removeTypingIndicator();
      this.addGuideMessage(`${eraNames[era]}的善化寺——${eraDescs[era]}`);
    }, 1000);
  }

  // ================================================================
  // UI 交互
  // ================================================================

  setupUI() {
    // 文物卡片关闭按钮
    document.getElementById('artifact-close').addEventListener('click', () => {
      this.hideArtifactCard();
    });

    // 展开故事按钮
    document.getElementById('btn-story').addEventListener('click', () => {
      const story = document.getElementById('artifact-story');
      story.classList.toggle('hidden');
    });

    // 发送消息按钮
    document.getElementById('btn-send').addEventListener('click', () => {
      const input = document.getElementById('guide-input');
      if (input.value.trim()) {
        this.handleUserQuestion(input.value.trim());
        input.value = '';
      }
    });

    // 全屏按钮
    document.getElementById('btn-fullscreen').addEventListener('click', () => {
      this.toggleFullscreen();
    });

    // 音效按钮
    document.getElementById('btn-sound').addEventListener('click', () => {
      this.toggleAmbientSound();
      const btn = document.getElementById('btn-sound');
      btn.style.color = this.state.soundEnabled ? 'var(--gold)' : 'var(--text-secondary)';
    });

    // 左侧面板 — FAB 展开/收起
    const fabLeft = document.getElementById('fab-left');
    const panelLeft = document.getElementById('panel-left');
    if (fabLeft && panelLeft) {
      fabLeft.addEventListener('click', () => {
        panelLeft.classList.toggle('collapsed');
        fabLeft.classList.toggle('active');
      });
    }
    const btnCloseLeft = document.getElementById('btn-close-left');
    if (btnCloseLeft) {
      btnCloseLeft.addEventListener('click', () => {
        panelLeft.classList.add('collapsed');
        fabLeft.classList.remove('active');
      });
    }
    // 保留旧按钮兼容
    const oldToggleLeft = document.getElementById('btn-toggle-left');
    if (oldToggleLeft) {
      oldToggleLeft.addEventListener('click', () => {
        panelLeft.classList.toggle('collapsed');
        fabLeft && fabLeft.classList.toggle('active');
      });
    }

    // 右侧面板 — FAB 展开/收起
    const fabRight = document.getElementById('fab-right');
    const panelRight = document.getElementById('panel-right');
    if (fabRight && panelRight) {
      fabRight.addEventListener('click', () => {
        panelRight.classList.toggle('collapsed');
        fabRight.classList.toggle('active');
      });
    }
    const btnCloseRight = document.getElementById('btn-close-right');
    if (btnCloseRight) {
      btnCloseRight.addEventListener('click', () => {
        panelRight.classList.add('collapsed');
        fabRight && fabRight.classList.remove('active');
      });
    }

    // 时间轴节点点击
    document.querySelectorAll('.timeline-node').forEach(node => {
      node.addEventListener('click', () => {
        this.switchEra(node.dataset.era);
      });
    });

    // 左侧任务列表点击（跳转到对应热点）
    document.querySelectorAll('.task-item').forEach(item => {
      item.addEventListener('click', () => {
        const taskId = item.dataset.task;
        const hotspot = CONFIG.hotspots.find(h => h.id === taskId);
        if (hotspot && this.viewer) {
          // Pannellum 视角旋转到热点位置
          this.viewer.lookAt(hotspot.pitch, hotspot.yaw, 90, 1000);
        }
        // 如果未完成则模拟点击
        if (!this.state.completedTasks.includes(taskId)) {
          this.onHotspotClick(taskId);
        } else {
          this.showArtifactCard(taskId);
        }
      });
    });
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }
}

// ---- 启动 ----
const app = new ShanHuaApp();
