/* Behaviour for each page section (state, open/close, map chapters). */

/* ---- Main ---- */
class MainSection extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { active: 0, open: 0, about: 1, proj: 0, resume: false, view: 'map' };
  }
  renderVals() {
    const data = [
      { place: 'Martin', x: 82, y: 44, lx: '32px', ly: '14px' },
      { place: 'Vienna', x: 77, y: 54, lx: '-62px', ly: '32px' },
      { place: 'Newton', x: 20.5, y: 53, lx: '-6px', ly: '40px' },
      { place: 'Northampton', x: 12, y: 46, lx: '-48px', ly: '-22px' },
      { place: 'Boston', x: 25.5, y: 43, lx: '32px', ly: '14px' }
    ];
    const a = this.state.active;
    const stops = data.map((d, i) => ({ ...d, label: d.place.toUpperCase(), num: i + 1, active: i === a, idle: i !== a, pick: () => this.setState({ active: i, view: 'chapter' }) }));
    const o = this.state.open;
    const ab = this.state.about;
    const tog = (i) => () => this.setState({ open: o === i ? -1 : i });
    const atog = (i) => () => this.setState({ about: ab === i ? -1 : i });
    const pj = this.state.proj;
    const ptog = (i) => () => this.setState({ proj: pj === i ? -1 : i });
    var jump = function (id) {
      return function (e) {
        try {
          var el = document.getElementById(id);
          if (!el) return;
          if (e && e.preventDefault) e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {}
      };
    };
    return {
      yes: true,
      goJourney: jump('journey'),
      goTop: jump('top'),
      stops,
      c0: a === 0, c1: a === 1, c2: a === 2, c3: a === 3, c4: a === 4,
      isFirst: a === 0, isLast: a === 4,
      prev: () => this.setState({ active: Math.max(0, a - 1) }),
      next: () => this.setState({ active: Math.min(4, a + 1) }),
      o0: o === 0, o1: o === 1, o2: o === 2, o3: o === 3,
      x0: o !== 0, x1: o !== 1, x2: o !== 2, x3: o !== 3,
      t0: tog(0), t1: tog(1), t2: tog(2), t3: tog(3),
      ab0: ab === 0, ab1: ab === 1, ab2: ab === 2, ab3: ab === 3,
      ax0: ab !== 0, ax1: ab !== 1, ax2: ab !== 2, ax3: ab !== 3,
      ac1: ab === 1 ? 'open' : '', ac2: ab === 2 ? 'open' : '', ac3: ab === 3 ? 'open' : '',
      a0: atog(0), a1: atog(1), a2: atog(2), a3: atog(3),
      po0: pj === 0, po1: pj === 1, po2: pj === 2,
      pc0: pj === 0 ? 'chosen' : '', pc1: pj === 1 ? 'chosen' : '', pc2: pj === 2 ? 'chosen' : '',
      p0: ptog(0), p1: ptog(1), p2: ptog(2),
      pclose: () => this.setState({ proj: -1 }),
      resumeOpen: this.state.resume,
      onMap: this.state.view === 'map',
      onChapter: this.state.view === 'chapter',
      backToMap: () => this.setState({ view: 'map' }),
      openResume: () => this.setState({ resume: true }),
      closeResume: () => this.setState({ resume: false })
    };
  }
}
registerComponent('Main', MainSection);

/* ---- Nav ---- */
class NavSection extends DCLogic {
  renderVals() {
    var cur = this.props.current || '';
    var scroll = this.props.mode === 'scroll';
    var jump = function (id) {
      return function (e) {
        try {
          var el = document.getElementById(id);
          if (!el) return;
          if (e && e.preventDefault) e.preventDefault();
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } catch (err) {}
      };
    };
    var items = [['about', 'ABOUT', 'About.dc.html'], ['journey', 'JOURNEY', 'Journey.dc.html'], ['writing', 'WRITING', 'Writing.dc.html'], ['contact', 'CONTACT', 'Contact.dc.html']];
    return {
      links: items.map(function (it) {
        return { label: it[1], href: scroll ? '#' + it[0] : it[2], cls: it[0] === cur ? 'on' : '', cur: it[0] === cur ? 'page' : 'false', go: scroll ? jump(it[0]) : null };
      }),
      showLogo: !this.props.hideLogo,
      homeHref: scroll ? '#top' : 'Main.dc.html',
      goHome: scroll ? jump('top') : null,
      justify: this.props.hideLogo ? 'flex-end' : 'space-between'
    };
  }
}
registerComponent('Nav', NavSection);

/* ---- About ---- */
class AboutSection extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { active: 0, open: 0, about: 1, proj: 0, resume: false, view: 'map', cert: false };
  }
  renderVals() {
    const data = [
      { place: 'Martin', x: 82, y: 44, lx: '32px', ly: '14px' },
      { place: 'Vienna', x: 77, y: 54, lx: '-62px', ly: '32px' },
      { place: 'Newton', x: 20.5, y: 53, lx: '-6px', ly: '40px' },
      { place: 'Northampton', x: 12, y: 46, lx: '-48px', ly: '-22px' },
      { place: 'Boston', x: 25.5, y: 43, lx: '32px', ly: '14px' }
    ];
    const a = this.state.active;
    const stops = data.map((d, i) => ({ ...d, label: d.place.toUpperCase(), num: i + 1, active: i === a, idle: i !== a, pick: () => this.setState({ active: i, view: 'chapter' }) }));
    const o = this.state.open;
    const ab = this.state.about;
    const tog = (i) => () => this.setState({ open: o === i ? -1 : i });
    const atog = (i) => () => this.setState({ about: ab === i ? -1 : i });
    const pj = this.state.proj;
    const ptog = (i) => () => this.setState({ proj: pj === i ? -1 : i });
    return {
      showNav: !this.props.embedded,
      stops,
      c0: a === 0, c1: a === 1, c2: a === 2, c3: a === 3, c4: a === 4,
      isFirst: a === 0, isLast: a === 4,
      prev: () => this.setState({ active: Math.max(0, a - 1) }),
      next: () => this.setState({ active: Math.min(4, a + 1) }),
      o0: o === 0, o1: o === 1, o2: o === 2, o3: o === 3,
      x0: o !== 0, x1: o !== 1, x2: o !== 2, x3: o !== 3,
      t0: tog(0), t1: tog(1), t2: tog(2), t3: tog(3),
      ab0: ab === 0, ab1: ab === 1, ab2: ab === 2, ab3: ab === 3,
      ax0: ab !== 0, ax1: ab !== 1, ax2: ab !== 2, ax3: ab !== 3,
      ac1: ab === 1 ? 'open' : '', ac2: ab === 2 ? 'open' : '', ac3: ab === 3 ? 'open' : '',
      a0: atog(0), a1: atog(1), a2: atog(2), a3: atog(3),
      po0: pj === 0, po1: pj === 1, po2: pj === 2,
      pc0: pj === 0 ? 'chosen' : '', pc1: pj === 1 ? 'chosen' : '', pc2: pj === 2 ? 'chosen' : '',
      p0: ptog(0), p1: ptog(1), p2: ptog(2),
      pclose: () => this.setState({ proj: -1 }),
      resumeOpen: this.state.resume,
      onMap: this.state.view === 'map',
      onChapter: this.state.view === 'chapter',
      backToMap: () => this.setState({ view: 'map' }),
      openResume: () => this.setState({ resume: true }),
      closeResume: () => this.setState({ resume: false }),
      certOpen: this.state.cert,
      openCert: () => this.setState({ cert: true }),
      closeCert: () => this.setState({ cert: false })
    };
  }
}
registerComponent('About', AboutSection);

/* ---- Journey ---- */
class JourneySection extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { active: 0, open: 0, about: 1, proj: 0, resume: false, view: 'map' };
  }
  renderVals() {
    const data = [
      { place: 'Martin', x: 82, y: 44, lx: '32px', ly: '14px' },
      { place: 'Vienna', x: 77, y: 54, lx: '-62px', ly: '32px' },
      { place: 'Newton', x: 20.5, y: 53, lx: '-6px', ly: '40px' },
      { place: 'Northampton', x: 12, y: 46, lx: '-48px', ly: '-22px' },
      { place: 'Boston', x: 25.5, y: 43, lx: '32px', ly: '14px' }
    ];
    const a = this.state.active;
    const stops = data.map((d, i) => ({ ...d, label: d.place.toUpperCase(), num: i + 1, active: i === a, idle: i !== a, pick: () => this.setState({ active: i, view: 'chapter' }) }));
    const o = this.state.open;
    const ab = this.state.about;
    const tog = (i) => () => this.setState({ open: o === i ? -1 : i });
    const atog = (i) => () => this.setState({ about: ab === i ? -1 : i });
    const pj = this.state.proj;
    const ptog = (i) => () => this.setState({ proj: pj === i ? -1 : i });
    return {
      showNav: !this.props.embedded,
      stops,
      c0: a === 0, c1: a === 1, c2: a === 2, c3: a === 3, c4: a === 4,
      isFirst: a === 0, isLast: a === 4,
      prev: () => this.setState({ active: Math.max(0, a - 1) }),
      next: () => this.setState({ active: Math.min(4, a + 1) }),
      o0: o === 0, o1: o === 1, o2: o === 2, o3: o === 3,
      x0: o !== 0, x1: o !== 1, x2: o !== 2, x3: o !== 3,
      t0: tog(0), t1: tog(1), t2: tog(2), t3: tog(3),
      ab0: ab === 0, ab1: ab === 1, ab2: ab === 2, ab3: ab === 3,
      ax0: ab !== 0, ax1: ab !== 1, ax2: ab !== 2, ax3: ab !== 3,
      ac1: ab === 1 ? 'open' : '', ac2: ab === 2 ? 'open' : '', ac3: ab === 3 ? 'open' : '',
      a0: atog(0), a1: atog(1), a2: atog(2), a3: atog(3),
      po0: pj === 0, po1: pj === 1, po2: pj === 2,
      pc0: pj === 0 ? 'chosen' : '', pc1: pj === 1 ? 'chosen' : '', pc2: pj === 2 ? 'chosen' : '',
      p0: ptog(0), p1: ptog(1), p2: ptog(2),
      pclose: () => this.setState({ proj: -1 }),
      resumeOpen: this.state.resume,
      onMap: this.state.view === 'map',
      onChapter: this.state.view === 'chapter',
      backToMap: () => this.setState({ view: 'map' }),
      openResume: () => this.setState({ resume: true }),
      closeResume: () => this.setState({ resume: false })
    };
  }
}
registerComponent('Journey', JourneySection);

/* ---- Writing ---- */
class WritingSection extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { active: 0, open: 0, about: 1, proj: 0, resume: false, view: 'map' };
  }
  renderVals() {
    const data = [
      { place: 'Martin', x: 82, y: 44, lx: '32px', ly: '14px' },
      { place: 'Vienna', x: 77, y: 54, lx: '-62px', ly: '32px' },
      { place: 'Newton', x: 20.5, y: 53, lx: '-6px', ly: '40px' },
      { place: 'Northampton', x: 12, y: 46, lx: '-48px', ly: '-22px' },
      { place: 'Boston', x: 25.5, y: 43, lx: '32px', ly: '14px' }
    ];
    const a = this.state.active;
    const stops = data.map((d, i) => ({ ...d, label: d.place.toUpperCase(), num: i + 1, active: i === a, idle: i !== a, pick: () => this.setState({ active: i, view: 'chapter' }) }));
    const o = this.state.open;
    const ab = this.state.about;
    const tog = (i) => () => this.setState({ open: o === i ? -1 : i });
    const atog = (i) => () => this.setState({ about: ab === i ? -1 : i });
    const pj = this.state.proj;
    const ptog = (i) => () => this.setState({ proj: pj === i ? -1 : i });
    return {
      showNav: !this.props.embedded,
      stops,
      c0: a === 0, c1: a === 1, c2: a === 2, c3: a === 3, c4: a === 4,
      isFirst: a === 0, isLast: a === 4,
      prev: () => this.setState({ active: Math.max(0, a - 1) }),
      next: () => this.setState({ active: Math.min(4, a + 1) }),
      o0: o === 0, o1: o === 1, o2: o === 2, o3: o === 3, o4: o === 4,
      rc0: o === 0 ? 'open' : '', rc1: o === 1 ? 'open' : '', rc2: o === 2 ? 'open' : '', rc3: o === 3 ? 'open' : '', rc4: o === 4 ? 'open' : '',
      x0: o !== 0, x1: o !== 1, x2: o !== 2, x3: o !== 3,
      t0: tog(0), t1: tog(1), t2: tog(2), t3: tog(3), t4: tog(4),
      ab0: ab === 0, ab1: ab === 1, ab2: ab === 2, ab3: ab === 3,
      ax0: ab !== 0, ax1: ab !== 1, ax2: ab !== 2, ax3: ab !== 3,
      ac1: ab === 1 ? 'open' : '', ac2: ab === 2 ? 'open' : '', ac3: ab === 3 ? 'open' : '',
      a0: atog(0), a1: atog(1), a2: atog(2), a3: atog(3),
      po0: pj === 0, po1: pj === 1, po2: pj === 2,
      pc0: pj === 0 ? 'chosen' : '', pc1: pj === 1 ? 'chosen' : '', pc2: pj === 2 ? 'chosen' : '',
      p0: ptog(0), p1: ptog(1), p2: ptog(2),
      pclose: () => this.setState({ proj: -1 }),
      resumeOpen: this.state.resume,
      onMap: this.state.view === 'map',
      onChapter: this.state.view === 'chapter',
      backToMap: () => this.setState({ view: 'map' }),
      openResume: () => this.setState({ resume: true }),
      closeResume: () => this.setState({ resume: false })
    };
  }
}
registerComponent('Writing', WritingSection);

/* ---- Contact ---- */
class ContactSection extends DCLogic {
  constructor(props) {
    super(props);
    this.state = { active: 0, open: 0, about: 1, proj: 0, resume: false, view: 'map' };
  }
  renderVals() {
    const data = [
      { place: 'Martin', x: 82, y: 44, lx: '32px', ly: '14px' },
      { place: 'Vienna', x: 77, y: 54, lx: '-62px', ly: '32px' },
      { place: 'Newton', x: 20.5, y: 53, lx: '-6px', ly: '40px' },
      { place: 'Northampton', x: 12, y: 46, lx: '-48px', ly: '-22px' },
      { place: 'Boston', x: 25.5, y: 43, lx: '32px', ly: '14px' }
    ];
    const a = this.state.active;
    const stops = data.map((d, i) => ({ ...d, label: d.place.toUpperCase(), num: i + 1, active: i === a, idle: i !== a, pick: () => this.setState({ active: i, view: 'chapter' }) }));
    const o = this.state.open;
    const ab = this.state.about;
    const tog = (i) => () => this.setState({ open: o === i ? -1 : i });
    const atog = (i) => () => this.setState({ about: ab === i ? -1 : i });
    const pj = this.state.proj;
    const ptog = (i) => () => this.setState({ proj: pj === i ? -1 : i });
    return {
      showNav: !this.props.embedded,
      stops,
      c0: a === 0, c1: a === 1, c2: a === 2, c3: a === 3, c4: a === 4,
      isFirst: a === 0, isLast: a === 4,
      prev: () => this.setState({ active: Math.max(0, a - 1) }),
      next: () => this.setState({ active: Math.min(4, a + 1) }),
      o0: o === 0, o1: o === 1, o2: o === 2, o3: o === 3,
      x0: o !== 0, x1: o !== 1, x2: o !== 2, x3: o !== 3,
      t0: tog(0), t1: tog(1), t2: tog(2), t3: tog(3),
      ab0: ab === 0, ab1: ab === 1, ab2: ab === 2, ab3: ab === 3,
      ax0: ab !== 0, ax1: ab !== 1, ax2: ab !== 2, ax3: ab !== 3,
      ac1: ab === 1 ? 'open' : '', ac2: ab === 2 ? 'open' : '', ac3: ab === 3 ? 'open' : '',
      a0: atog(0), a1: atog(1), a2: atog(2), a3: atog(3),
      po0: pj === 0, po1: pj === 1, po2: pj === 2,
      pc0: pj === 0 ? 'chosen' : '', pc1: pj === 1 ? 'chosen' : '', pc2: pj === 2 ? 'chosen' : '',
      p0: ptog(0), p1: ptog(1), p2: ptog(2),
      pclose: () => this.setState({ proj: -1 }),
      resumeOpen: this.state.resume,
      onMap: this.state.view === 'map',
      onChapter: this.state.view === 'chapter',
      backToMap: () => this.setState({ view: 'map' }),
      openResume: () => this.setState({ resume: true }),
      closeResume: () => this.setState({ resume: false })
    };
  }
}
registerComponent('Contact', ContactSection);

/* ---- Martin ---- */
class MartinSection extends DCLogic {
  renderVals() { return {}; }
}
registerComponent('Martin', MartinSection);

/* ---- Vienna ---- */
class ViennaSection extends DCLogic {
  renderVals() { return {}; }
}
registerComponent('Vienna', ViennaSection);

/* ---- Newton ---- */
class NewtonSection extends DCLogic {
  renderVals() { return {}; }
}
registerComponent('Newton', NewtonSection);

/* ---- Northampton ---- */
class NorthamptonSection extends DCLogic {
  renderVals() { return {}; }
}
registerComponent('Northampton', NorthamptonSection);

/* ---- Boston ---- */
class BostonSection extends DCLogic {
  renderVals() { return {}; }
}
registerComponent('Boston', BostonSection);
