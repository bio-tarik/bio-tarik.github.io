
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function null_to_empty(value) {
        return value == null ? '' : value;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }
    class HtmlTag {
        constructor(anchor = null) {
            this.a = anchor;
            this.e = this.n = null;
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.h(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ``}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = program.b - t;
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.24.0' }, detail)));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev("SvelteDOMSetData", { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = [];
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (let i = 0; i < subscribers.length; i += 1) {
                        const s = subscribers[i];
                        s[1]();
                        subscriber_queue.push(s, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.push(subscriber);
            if (subscribers.length === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                const index = subscribers.indexOf(subscriber);
                if (index !== -1) {
                    subscribers.splice(index, 1);
                }
                if (subscribers.length === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    /**
     * Dumb i18n
     *
     * How to use:
     *
     * In your component's <script> part:
     *     import { i18n } from '../stores/i18n.js';
     *
     * i18n is an ES6 template literals function.
     *
     * So in your component's HTML part:
     *    use {$i18n`key`}
     * or use {@html $i18n`key`} if your content has some markup.
     *
     * As it is a template literal, you can put placeholders in it:
     *    use {$i18n`${someVarValue}`}
     *
     * I don't know if it will be of any use, but there you have it.
     *
     **/

    const langs = ["en", "pt", "it"];
    const labelsByLang = {
      pt: {
        home: {
          sectionId: "home",
          heading: ["Tarik", "Ayoub"],
          paragraph: "Desenvolvedor Web Full Stack"
        },
        profile: {
          sectionId: "perfil",
          heading: "Perfil",
          paragraph: [
            "Sou um desenvolvedor web <strong>full stack</strong> com perfil <strong>autodidata</strong>, multidisciplinar e proativo.",
            "Atuo na área de TI <strong>desde 2013</strong> como analista <strong>desenvolvedor</strong>. Possuo experiência no desenvolvimento, implantação e manutenção de sistemas complexos e com tecnologias relevantes.",
            "Além das capacidades técnicas possuo vivência em projetos ágeis e experiência com trabalho remoto."
          ]
        },
        skills: {
          sectionId: "competencias",
          heading: "Competências"
        },
        contact: {
          sectionId: "contato",
          heading: "Contato",
          nameLabel: "Seu nome",
          emailLabel: "Seu email",
          messageLabel: "Escreva para mim",
          sendButton: "Enviar",
          okMessage:
            "Obrigado pelo contato! E daqui a pouco te mando uma resposta :)",
          errorMessage:
            "Oops... alguma coisa deu errado. Se possível mande um email para <span>bio.tarik</span>@<span>gmail</span><span>.com</span>"
        }
      },
      en: {
        home: {
          sectionId: "home",
          heading: ["Tarik", "Ayoub"],
          paragraph: "Full Stack Web Developer"
        },
        profile: {
          sectionId: "perfil",
          heading: "Profile",
          paragraph: [
            "I am a <strong>full stack</strong> web developer. I have been working in IT <strong>since 2013</strong> as a analyst <strong>developer</strong>.",
            "I am experienced in developing, deploying and maintaining complex and technologically relevant systems. Besides these technical competences I also have knowledge of agile methodologies and remote work.",
            "Key competencies: <strong>autodidact</strong>, proactive and a multidisciplinary background."
          ]
        },
        skills: {
          sectionId: "competencias",
          heading: "Skills"
        },
        contact: {
          sectionId: "contato",
          heading: "Contact",
          nameLabel: "Your name",
          emailLabel: "Your email",
          messageLabel: "Write me a message",
          sendButton: "Send",
          okMessage:
            "Thank you for getting in touch! I'll write you a message soon :)",
          errorMessage:
            "Oops... something went wrong. If possible email me at <span>bio.tarik</span>@<span>gmail</span><span>.com</span>"
        }
      },
      it: {
        home: {
          sectionId: "home",
          heading: ["Tarik", "Ayoub"],
          paragraph: "Sviluppatore Web Full Stack"
        },
        profile: {
          sectionId: "perfil",
          heading: "Profilo",
          paragraph: [
            "​Sono uno sviluppatore web <strong>full stack</strong> proattivo, interdisciplinare e <strong>autodidatta</strong>.",
            "Lavoro <strong>dal 2013</strong> come analista <strong>sviluppatore</strong>. Ho esperienza nello sviluppo, deployment e manutenzione dei sistemi complessi e tecnologicamente rilevanti.",
            "A parte le competenze tecniche conosco le metodologie agile e ho esperienza nel lavoro da remoto."
          ]
        },
        skills: {
          sectionId: "competencias",
          heading: "Competenze"
        },
        contact: {
          sectionId: "contato",
          heading: "Contatto",
          nameLabel: "Il tuo nome",
          emailLabel: "La tua email",
          messageLabel: "Scrivimi una mail",
          sendButton: "Invio",
          okMessage: "Grazie per il tuo messaggio! Ti risponderò subito :)",
          errorMessage:
            "Oops... qualcosa è andata storta. Se possibile mi invii una mail su <span>bio.tarik</span>@<span>gmail</span><span>.com</span>"
        }
      }
    };
    function switchLang(newLang) {
      if (langs.indexOf(newLang) < 0) {
        return;
      }
      lang.set(newLang);
      i18n.set(i18nTemplateLiteralCurried(newLang));
    }

    const DEFAULT_LANG = "en";

    const i18nTemplateLiteralCurried = lang => literals => {
      return labelsByLang[lang][literals.map(literal => literal).join("")];
    };

    const lang = writable(DEFAULT_LANG);
    const i18n = writable(i18nTemplateLiteralCurried(DEFAULT_LANG));

    /* src/components/SectionTitle.svelte generated by Svelte v3.24.0 */

    const file = "src/components/SectionTitle.svelte";

    function create_fragment(ctx) {
    	let h2;
    	let t;

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			t = text(/*text*/ ctx[0]);
    			attr_dev(h2, "id", /*id*/ ctx[1]);
    			attr_dev(h2, "class", "font-main-color svelte-1m9sp3p");
    			add_location(h2, file, 15, 0, 201);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			append_dev(h2, t);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*text*/ 1) set_data_dev(t, /*text*/ ctx[0]);

    			if (dirty & /*id*/ 2) {
    				attr_dev(h2, "id", /*id*/ ctx[1]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { text } = $$props;
    	let { id } = $$props;
    	const writable_props = ["text", "id"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SectionTitle> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("SectionTitle", $$slots, []);

    	$$self.$set = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({ text, id });

    	$$self.$inject_state = $$props => {
    		if ("text" in $$props) $$invalidate(0, text = $$props.text);
    		if ("id" in $$props) $$invalidate(1, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [text, id];
    }

    class SectionTitle extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { text: 0, id: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SectionTitle",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*text*/ ctx[0] === undefined && !("text" in props)) {
    			console.warn("<SectionTitle> was created without expected prop 'text'");
    		}

    		if (/*id*/ ctx[1] === undefined && !("id" in props)) {
    			console.warn("<SectionTitle> was created without expected prop 'id'");
    		}
    	}

    	get text() {
    		throw new Error("<SectionTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set text(value) {
    		throw new Error("<SectionTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get id() {
    		throw new Error("<SectionTitle>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<SectionTitle>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/EmailForm.svelte generated by Svelte v3.24.0 */

    const file$1 = "src/components/EmailForm.svelte";

    // (92:2) {#if emailSent}
    function create_if_block_1(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*okMessage*/ ctx[4]);
    			attr_dev(p, "class", "validationMessage svelte-1k3x5mx");
    			attr_dev(p, "id", "okMessage");
    			add_location(p, file$1, 92, 4, 1953);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*okMessage*/ 16) set_data_dev(t, /*okMessage*/ ctx[4]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(92:2) {#if emailSent}",
    		ctx
    	});

    	return block;
    }

    // (96:2) {#if hasError}
    function create_if_block(ctx) {
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*errorMessage*/ ctx[5]);
    			attr_dev(p, "class", "validationMessage svelte-1k3x5mx");
    			attr_dev(p, "id", "errorMessage");
    			add_location(p, file$1, 96, 4, 2043);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*errorMessage*/ 32) set_data_dev(t, /*errorMessage*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(96:2) {#if hasError}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let form;
    	let button0;
    	let t0;
    	let t1;
    	let t2;
    	let input0;
    	let t3;
    	let input1;
    	let t4;
    	let textarea;
    	let textarea_placeholder_value;
    	let t5;
    	let input2;
    	let t6;
    	let button1;
    	let t7;
    	let mounted;
    	let dispose;
    	let if_block0 = /*emailSent*/ ctx[7] && create_if_block_1(ctx);
    	let if_block1 = /*hasError*/ ctx[6] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			form = element("form");
    			button0 = element("button");
    			t0 = space();
    			if (if_block0) if_block0.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			t2 = space();
    			input0 = element("input");
    			t3 = space();
    			input1 = element("input");
    			t4 = space();
    			textarea = element("textarea");
    			t5 = space();
    			input2 = element("input");
    			t6 = space();
    			button1 = element("button");
    			t7 = text(/*sendButton*/ ctx[3]);
    			attr_dev(button0, "type", "submit");
    			button0.disabled = true;
    			set_style(button0, "display", "none");
    			attr_dev(button0, "aria-hidden", "true");
    			attr_dev(button0, "class", "svelte-1k3x5mx");
    			add_location(button0, file$1, 89, 2, 1855);
    			attr_dev(input0, "class", "form-input svelte-1k3x5mx");
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "name", "name");
    			attr_dev(input0, "placeholder", /*nameLabel*/ ctx[0]);
    			input0.required = true;
    			attr_dev(input0, "aria-label", /*nameLabel*/ ctx[0]);
    			add_location(input0, file$1, 99, 2, 2120);
    			attr_dev(input1, "type", "email");
    			attr_dev(input1, "class", "form-input svelte-1k3x5mx");
    			attr_dev(input1, "name", "email");
    			attr_dev(input1, "placeholder", /*emailLabel*/ ctx[1]);
    			input1.required = true;
    			attr_dev(input1, "aria-label", /*emailLabel*/ ctx[1]);
    			add_location(input1, file$1, 106, 2, 2255);
    			attr_dev(textarea, "name", "message");
    			attr_dev(textarea, "class", "form-input svelte-1k3x5mx");
    			attr_dev(textarea, "placeholder", textarea_placeholder_value = "" + (/*messageLabel*/ ctx[2] + "..."));
    			textarea.required = true;
    			attr_dev(textarea, "aria-label", /*messageLabel*/ ctx[2]);
    			add_location(textarea, file$1, 113, 2, 2394);
    			attr_dev(input2, "type", "text");
    			attr_dev(input2, "name", "_gotcha");
    			set_style(input2, "display", "none");
    			attr_dev(input2, "class", "svelte-1k3x5mx");
    			add_location(input2, file$1, 119, 2, 2530);
    			attr_dev(button1, "class", "form-button svelte-1k3x5mx");
    			attr_dev(button1, "id", "contact-button");
    			attr_dev(button1, "type", "submit");
    			add_location(button1, file$1, 121, 2, 2591);
    			attr_dev(form, "id", "contactform");
    			attr_dev(form, "class", "svelte-1k3x5mx");
    			add_location(form, file$1, 87, 0, 1738);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, form, anchor);
    			append_dev(form, button0);
    			append_dev(form, t0);
    			if (if_block0) if_block0.m(form, null);
    			append_dev(form, t1);
    			if (if_block1) if_block1.m(form, null);
    			append_dev(form, t2);
    			append_dev(form, input0);
    			append_dev(form, t3);
    			append_dev(form, input1);
    			append_dev(form, t4);
    			append_dev(form, textarea);
    			append_dev(form, t5);
    			append_dev(form, input2);
    			append_dev(form, t6);
    			append_dev(form, button1);
    			append_dev(button1, t7);

    			if (!mounted) {
    				dispose = listen_dev(form, "submit", prevent_default(/*handleSubmit*/ ctx[8]), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*emailSent*/ ctx[7]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					if_block0.m(form, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*hasError*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(form, t2);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (dirty & /*nameLabel*/ 1) {
    				attr_dev(input0, "placeholder", /*nameLabel*/ ctx[0]);
    			}

    			if (dirty & /*nameLabel*/ 1) {
    				attr_dev(input0, "aria-label", /*nameLabel*/ ctx[0]);
    			}

    			if (dirty & /*emailLabel*/ 2) {
    				attr_dev(input1, "placeholder", /*emailLabel*/ ctx[1]);
    			}

    			if (dirty & /*emailLabel*/ 2) {
    				attr_dev(input1, "aria-label", /*emailLabel*/ ctx[1]);
    			}

    			if (dirty & /*messageLabel*/ 4 && textarea_placeholder_value !== (textarea_placeholder_value = "" + (/*messageLabel*/ ctx[2] + "..."))) {
    				attr_dev(textarea, "placeholder", textarea_placeholder_value);
    			}

    			if (dirty & /*messageLabel*/ 4) {
    				attr_dev(textarea, "aria-label", /*messageLabel*/ ctx[2]);
    			}

    			if (dirty & /*sendButton*/ 8) set_data_dev(t7, /*sendButton*/ ctx[3]);
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(form);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { nameLabel } = $$props;
    	let { emailLabel } = $$props;
    	let { messageLabel } = $$props;
    	let { sendButton } = $$props;
    	let { okMessage } = $$props;
    	let { errorMessage } = $$props;
    	let hasError = false;
    	let emailSent = false;

    	async function handleSubmit(event) {
    		if (event.target.id === "contactform") {
    			sendMail(event.target);
    		}
    	}

    	const sendMail = form => {
    		var data = new FormData(form);
    		var req = new XMLHttpRequest();
    		req.open("POST", `https://formcarry.com/s/ZVdAIg81Lst`, true);
    		req.setRequestHeader("Accept", "application/json");
    		req.onload = () => $$invalidate(7, emailSent = true);
    		req.onerror = () => $$invalidate(6, hasError = true);
    		req.send(data);
    	};

    	const writable_props = [
    		"nameLabel",
    		"emailLabel",
    		"messageLabel",
    		"sendButton",
    		"okMessage",
    		"errorMessage"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<EmailForm> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("EmailForm", $$slots, []);

    	$$self.$set = $$props => {
    		if ("nameLabel" in $$props) $$invalidate(0, nameLabel = $$props.nameLabel);
    		if ("emailLabel" in $$props) $$invalidate(1, emailLabel = $$props.emailLabel);
    		if ("messageLabel" in $$props) $$invalidate(2, messageLabel = $$props.messageLabel);
    		if ("sendButton" in $$props) $$invalidate(3, sendButton = $$props.sendButton);
    		if ("okMessage" in $$props) $$invalidate(4, okMessage = $$props.okMessage);
    		if ("errorMessage" in $$props) $$invalidate(5, errorMessage = $$props.errorMessage);
    	};

    	$$self.$capture_state = () => ({
    		nameLabel,
    		emailLabel,
    		messageLabel,
    		sendButton,
    		okMessage,
    		errorMessage,
    		hasError,
    		emailSent,
    		handleSubmit,
    		sendMail
    	});

    	$$self.$inject_state = $$props => {
    		if ("nameLabel" in $$props) $$invalidate(0, nameLabel = $$props.nameLabel);
    		if ("emailLabel" in $$props) $$invalidate(1, emailLabel = $$props.emailLabel);
    		if ("messageLabel" in $$props) $$invalidate(2, messageLabel = $$props.messageLabel);
    		if ("sendButton" in $$props) $$invalidate(3, sendButton = $$props.sendButton);
    		if ("okMessage" in $$props) $$invalidate(4, okMessage = $$props.okMessage);
    		if ("errorMessage" in $$props) $$invalidate(5, errorMessage = $$props.errorMessage);
    		if ("hasError" in $$props) $$invalidate(6, hasError = $$props.hasError);
    		if ("emailSent" in $$props) $$invalidate(7, emailSent = $$props.emailSent);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		nameLabel,
    		emailLabel,
    		messageLabel,
    		sendButton,
    		okMessage,
    		errorMessage,
    		hasError,
    		emailSent,
    		handleSubmit
    	];
    }

    class EmailForm extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {
    			nameLabel: 0,
    			emailLabel: 1,
    			messageLabel: 2,
    			sendButton: 3,
    			okMessage: 4,
    			errorMessage: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "EmailForm",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*nameLabel*/ ctx[0] === undefined && !("nameLabel" in props)) {
    			console.warn("<EmailForm> was created without expected prop 'nameLabel'");
    		}

    		if (/*emailLabel*/ ctx[1] === undefined && !("emailLabel" in props)) {
    			console.warn("<EmailForm> was created without expected prop 'emailLabel'");
    		}

    		if (/*messageLabel*/ ctx[2] === undefined && !("messageLabel" in props)) {
    			console.warn("<EmailForm> was created without expected prop 'messageLabel'");
    		}

    		if (/*sendButton*/ ctx[3] === undefined && !("sendButton" in props)) {
    			console.warn("<EmailForm> was created without expected prop 'sendButton'");
    		}

    		if (/*okMessage*/ ctx[4] === undefined && !("okMessage" in props)) {
    			console.warn("<EmailForm> was created without expected prop 'okMessage'");
    		}

    		if (/*errorMessage*/ ctx[5] === undefined && !("errorMessage" in props)) {
    			console.warn("<EmailForm> was created without expected prop 'errorMessage'");
    		}
    	}

    	get nameLabel() {
    		throw new Error("<EmailForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nameLabel(value) {
    		throw new Error("<EmailForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emailLabel() {
    		throw new Error("<EmailForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emailLabel(value) {
    		throw new Error("<EmailForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get messageLabel() {
    		throw new Error("<EmailForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set messageLabel(value) {
    		throw new Error("<EmailForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sendButton() {
    		throw new Error("<EmailForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sendButton(value) {
    		throw new Error("<EmailForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get okMessage() {
    		throw new Error("<EmailForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set okMessage(value) {
    		throw new Error("<EmailForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errorMessage() {
    		throw new Error("<EmailForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorMessage(value) {
    		throw new Error("<EmailForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Contact.svelte generated by Svelte v3.24.0 */
    const file$2 = "src/components/Contact.svelte";

    function create_fragment$2(ctx) {
    	let section;
    	let sectiontitle;
    	let t0;
    	let div;
    	let a0;
    	let svg0;
    	let title0;
    	let t1;
    	let defs0;
    	let g0;
    	let path0;
    	let t2;
    	let a1;
    	let svg1;
    	let title1;
    	let t3;
    	let defs1;
    	let g2;
    	let g1;
    	let path1;
    	let path2;
    	let path3;
    	let t4;
    	let a2;
    	let svg2;
    	let title2;
    	let t5;
    	let defs2;
    	let g4;
    	let g3;
    	let path4;
    	let path5;
    	let path6;
    	let t6;
    	let emailform;
    	let section_class_value;
    	let current;

    	sectiontitle = new SectionTitle({
    			props: {
    				id: /*sectionId*/ ctx[0],
    				text: /*heading*/ ctx[1]
    			},
    			$$inline: true
    		});

    	emailform = new EmailForm({
    			props: {
    				nameLabel: /*nameLabel*/ ctx[2],
    				emailLabel: /*emailLabel*/ ctx[3],
    				messageLabel: /*messageLabel*/ ctx[4],
    				sendButton: /*sendButton*/ ctx[5],
    				okMessage: /*okMessage*/ ctx[6],
    				errorMessage: /*errorMessage*/ ctx[7]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(sectiontitle.$$.fragment);
    			t0 = space();
    			div = element("div");
    			a0 = element("a");
    			svg0 = svg_element("svg");
    			title0 = svg_element("title");
    			t1 = text("Have a look at my Github repositories");
    			defs0 = svg_element("defs");
    			g0 = svg_element("g");
    			path0 = svg_element("path");
    			t2 = space();
    			a1 = element("a");
    			svg1 = svg_element("svg");
    			title1 = svg_element("title");
    			t3 = text("Be sure to check my Linkedin profile");
    			defs1 = svg_element("defs");
    			g2 = svg_element("g");
    			g1 = svg_element("g");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			t4 = space();
    			a2 = element("a");
    			svg2 = svg_element("svg");
    			title2 = svg_element("title");
    			t5 = text("On my Instagram you can glance at some personal stuff of mine\n        ");
    			defs2 = svg_element("defs");
    			g4 = svg_element("g");
    			g3 = svg_element("g");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			t6 = space();
    			create_component(emailform.$$.fragment);
    			attr_dev(title0, "id", "githubTitle");
    			add_location(title0, file$2, 73, 8, 1609);
    			attr_dev(defs0, "id", "defs33");
    			add_location(defs0, file$2, 74, 8, 1687);
    			attr_dev(path0, "class", "fill-main-color");
    			attr_dev(path0, "d", "m 412.22103,420.8226 c -33.347,0 -60.388,-27.036 -60.388,-60.388\n            0,-26.681 17.303,-49.317 41.297,-57.302 3.018,-0.559 4.126,1.31\n            4.126,2.905 0,1.44 -0.056,6.197 -0.082,11.243 -16.8,-3.653\n            -20.345,7.125 -20.345,7.125 -2.747,6.98 -6.705,8.836 -6.705,8.836\n            -5.479,3.748 0.413,3.671 0.413,3.671 6.064,-0.425 9.257,-6.224\n            9.257,-6.224 5.386,-9.231 14.127,-6.562 17.573,-5.019 0.542,3.903\n            2.107,6.568 3.834,8.075 -13.413,1.527 -27.513,6.705 -27.513,29.844\n            0,6.593 2.359,11.98 6.222,16.209 -0.627,1.522 -2.694,7.663\n            0.585,15.981 0,0 5.071,1.623 16.611,-6.19 4.817,1.338 9.983,2.009\n            15.115,2.032 5.132,-0.023 10.302,-0.694 15.12801,-2.032 11.526,7.813\n            16.59,6.19 16.59,6.19 3.28699,-8.318 1.21899,-14.459 0.59199,-15.981\n            3.87201,-4.229 6.21501,-9.616 6.21501,-16.209 0,-23.194\n            -14.127,-28.301 -27.57401,-29.796 2.166,-1.874 4.09601,-5.549\n            4.09601,-11.183 0,-8.08 -0.07,-14.583 -0.07,-16.572 0,-1.607\n            1.087,-3.49 4.148,-2.897 23.98099,7.994 41.262,30.622 41.262,57.294\n            -3e-5,33.352 -27.03703,60.388 -60.38703,60.388");
    			set_style(path0, "fill-rule", "evenodd");
    			set_style(path0, "stroke", "none");
    			set_style(path0, "stroke-width", "0.09999999");
    			attr_dev(path0, "id", "path45");
    			add_location(path0, file$2, 78, 10, 1825);
    			attr_dev(g0, "transform", "matrix(1.3333333,0,0,-1.3333333,-469.11069,561.09679)");
    			attr_dev(g0, "id", "g37");
    			add_location(g0, file$2, 75, 8, 1716);
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "aria-labelledby", "githubTitle");
    			attr_dev(svg0, "class", "external-logo svelte-iqzt2l");
    			attr_dev(svg0, "xmlns:dc", "http://purl.org/dc/elements/1.1/");
    			attr_dev(svg0, "xmlns:cc", "http://creativecommons.org/ns#");
    			attr_dev(svg0, "xmlns:rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
    			attr_dev(svg0, "xmlns:svg", "http://www.w3.org/2000/svg");
    			attr_dev(svg0, "role", "img");
    			attr_dev(svg0, "viewBox", "0 0 161.03334 157.05838");
    			attr_dev(svg0, "height", "157.05838");
    			attr_dev(svg0, "width", "161.03334");
    			attr_dev(svg0, "xml:space", "preserve");
    			attr_dev(svg0, "id", "svg29");
    			attr_dev(svg0, "version", "1.1");
    			add_location(svg0, file$2, 58, 6, 1087);
    			attr_dev(a0, "href", "https://github.com/bio-tarik");
    			add_location(a0, file$2, 57, 4, 1041);
    			attr_dev(title1, "id", "linkedinTitle");
    			add_location(title1, file$2, 118, 8, 3793);
    			attr_dev(defs1, "id", "defs33");
    			add_location(defs1, file$2, 119, 8, 3872);
    			attr_dev(path1, "class", "fill-main-color");
    			attr_dev(path1, "id", "path41");
    			set_style(path1, "fill-rule", "nonzero");
    			set_style(path1, "stroke", "none");
    			attr_dev(path1, "d", "m 398.555,72.0117 h -4.18 v 8.4688 h 5.293 c 2.754,0\n              5.867,-0.4532 5.867,-4.0352 0,-4.1015 -3.14,-4.4336 -6.98,-4.4336\n              z m 4.16,-2.5195 c 4.226,0.5195 6.445,2.8516 6.445,6.7578 0,4.7656\n              -2.898,7.0781 -8.84,7.0781 h -9.527 V 58.2617 h 3.582 v 10.918 h\n              4.434 l 0.086,-0.1367 6.898,-10.7813 h 3.824 l -7.383,11.1641\n              0.481,0.0664");
    			add_location(path1, file$2, 122, 12, 4022);
    			attr_dev(path2, "class", "fill-main-color");
    			attr_dev(path2, "id", "path43");
    			set_style(path2, "fill-rule", "nonzero");
    			set_style(path2, "stroke", "none");
    			attr_dev(path2, "d", "m 398.965,50.1563 c -11.348,0 -20.254,8.9648 -20.254,20.6054\n              0,11.6328 8.906,20.6055 20.254,20.6055 11.355,0 20.246,-8.9727\n              20.246,-20.6055 0,-11.6406 -8.891,-20.6054 -20.246,-20.6054 z m\n              0,44.3164 c -13.313,0 -23.738,-10.4102 -23.738,-23.711 0,-13.3125\n              10.425,-23.7109 23.738,-23.7109 13.293,0 23.723,10.3984\n              23.723,23.7109 0,13.3008 -10.43,23.711 -23.723,23.711");
    			add_location(path2, file$2, 132, 12, 4573);
    			attr_dev(path3, "class", "fill-main-color");
    			attr_dev(path3, "id", "path45");
    			set_style(path3, "fill-rule", "nonzero");
    			set_style(path3, "stroke", "none");
    			attr_dev(path3, "d", "m 306.77,53.2422 h -53.391 v 83.5428 c 0,19.926 -0.344,45.555\n              -27.742,45.555 -27.785,0 -32.024,-21.715 -32.024,-44.125 V 53.2422\n              H 140.281 V 225.039 h 51.184 v -23.484 h 0.73 c 7.121,13.504\n              24.543,27.746 50.52,27.746 54.062,0 64.055,-35.571 64.055,-81.84 z\n              M 80.0781,248.512 c -17.1484,0 -30.9765,13.871 -30.9765,30.965\n              0,17.089 13.8281,30.964 30.9765,30.964 17.0821,0 30.9449,-13.875\n              30.9449,-30.964 0,-17.094 -13.8628,-30.965 -30.9449,-30.965 z M\n              106.785,53.2422 H 53.3398 V 225.039 H 106.785 Z M 333.359,360 H\n              26.5508 C 11.9063,360 0,348.379 0,334.043 V 25.9766 C 0,11.6406\n              11.9063,0 26.5508,0 H 333.359 c 14.676,0 26.629,11.6406\n              26.629,25.9766 V 334.043 c 0,14.336 -11.953,25.957 -26.629,25.957");
    			add_location(path3, file$2, 142, 12, 5162);
    			attr_dev(g1, "transform", "scale(0.1)");
    			attr_dev(g1, "id", "g39");
    			add_location(g1, file$2, 121, 10, 3974);
    			attr_dev(g2, "transform", "matrix(1.3333333,0,0,-1.3333333,0,48)");
    			attr_dev(g2, "id", "g37");
    			add_location(g2, file$2, 120, 8, 3901);
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "aria-labelledby", "linkedinTitle");
    			attr_dev(svg1, "class", "external-logo svelte-iqzt2l");
    			attr_dev(svg1, "xmlns:dc", "http://purl.org/dc/elements/1.1/");
    			attr_dev(svg1, "xmlns:cc", "http://creativecommons.org/ns#");
    			attr_dev(svg1, "xmlns:rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
    			attr_dev(svg1, "xmlns:svg", "http://www.w3.org/2000/svg");
    			attr_dev(svg1, "role", "img");
    			attr_dev(svg1, "viewBox", "0 0 56.360001 48");
    			attr_dev(svg1, "height", "48");
    			attr_dev(svg1, "width", "56.360001");
    			attr_dev(svg1, "xml:space", "preserve");
    			attr_dev(svg1, "id", "svg29");
    			attr_dev(svg1, "version", "1.1");
    			add_location(svg1, file$2, 103, 6, 3283);
    			attr_dev(a1, "href", "https://www.linkedin.com/in/tayoub/");
    			add_location(a1, file$2, 102, 4, 3230);
    			attr_dev(title2, "id", "InstagramTitle");
    			add_location(title2, file$2, 178, 8, 6799);
    			attr_dev(defs2, "id", "defs124");
    			add_location(defs2, file$2, 181, 8, 6924);
    			attr_dev(path4, "class", "fill-main-color");
    			attr_dev(path4, "id", "path132");
    			set_style(path4, "fill-rule", "nonzero");
    			set_style(path4, "stroke", "none");
    			attr_dev(path4, "d", "m 2519.21,5038.41 c -684.18,0 -769.97,-2.9 -1038.67,-15.16 C\n              1212.4,5011.02 1029.27,4968.43 869.027,4906.16 703.367,4841.78\n              562.879,4755.64 422.824,4615.59 282.773,4475.54 196.633,4335.04\n              132.254,4169.38 69.9805,4009.14 27.3945,3826.01 15.1563,3557.87\n              2.89844,3289.17 0,3203.38 0,2519.2 0,1835.03 2.89844,1749.24\n              15.1563,1480.54 27.3945,1212.4 69.9805,1029.27 132.254,869.031\n              196.633,703.371 282.773,562.879 422.824,422.82 562.879,282.77\n              703.367,196.629 869.027,132.25 1029.27,69.9805 1212.4,27.3906\n              1480.54,15.1602 1749.24,2.90234 1835.03,0 2519.21,0 c 684.17,0\n              769.96,2.90234 1038.66,15.1602 268.14,12.2304 451.27,54.8203\n              611.51,117.0898 165.66,64.379 306.15,150.52 446.21,290.57\n              140.05,140.059 226.19,280.551 290.57,446.211 62.27,160.239\n              104.86,343.369 117.09,611.509 12.26,268.7 15.16,354.49\n              15.16,1038.66 0,684.18 -2.9,769.97 -15.16,1038.67 -12.23,268.14\n              -54.82,451.27 -117.09,611.51 -64.38,165.66 -150.52,306.16\n              -290.57,446.21 -140.06,140.05 -280.55,226.19 -446.21,290.57\n              -160.24,62.27 -343.37,104.86 -611.51,117.09 -268.7,12.26\n              -354.49,15.16 -1038.66,15.16 z m 0,-453.91 c 672.65,0 752.33,-2.57\n              1017.97,-14.69 245.62,-11.2 379.01,-52.24 467.78,-86.74\n              117.59,-45.7 201.51,-100.29 289.66,-188.44 88.16,-88.16\n              142.75,-172.08 188.45,-289.67 34.5,-88.77 75.54,-222.16\n              86.74,-467.78 12.12,-265.64 14.69,-345.32 14.69,-1017.98 0,-672.65\n              -2.57,-752.33 -14.69,-1017.97 -11.2,-245.62 -52.24,-379.01\n              -86.74,-467.78 -45.7,-117.591 -100.29,-201.509 -188.45,-289.661\n              -88.15,-88.16 -172.07,-142.75 -289.66,-188.449 -88.77,-34.5\n              -222.16,-75.539 -467.78,-86.738 -265.6,-12.122 -345.27,-14.692\n              -1017.97,-14.692 -672.71,0 -752.37,2.57 -1017.98,14.692\n              -245.62,11.199 -379.01,52.238 -467.78,86.738 -117.591,45.699\n              -201.509,100.289 -289.661,188.449 -88.152,88.152 -142.75,172.07\n              -188.449,289.661 -34.5,88.77 -75.535,222.16 -86.742,467.78\n              -12.121,265.64 -14.688,345.32 -14.688,1017.97 0,672.66\n              2.567,752.34 14.688,1017.98 11.207,245.62 52.242,379.01\n              86.742,467.78 45.699,117.59 100.293,201.51 188.445,289.66\n              88.156,88.16 172.074,142.75 289.665,188.45 88.77,34.5 222.16,75.54\n              467.78,86.74 265.64,12.12 345.32,14.69 1017.98,14.69");
    			add_location(path4, file$2, 184, 12, 7093);
    			attr_dev(path5, "class", "fill-main-color");
    			attr_dev(path5, "id", "path134");
    			set_style(path5, "fill-rule", "nonzero");
    			set_style(path5, "stroke", "none");
    			attr_dev(path5, "d", "m 2519.21,1679.47 c -463.78,0 -839.74,375.96 -839.74,839.73\n              0,463.78 375.96,839.74 839.74,839.74 463.77,0 839.73,-375.96\n              839.73,-839.74 0,-463.77 -375.96,-839.73 -839.73,-839.73 z m\n              0,2133.38 c -714.47,0 -1293.65,-579.18 -1293.65,-1293.65 0,-714.46\n              579.18,-1293.64 1293.65,-1293.64 714.46,0 1293.64,579.18\n              1293.64,1293.64 0,714.47 -579.18,1293.65 -1293.64,1293.65");
    			add_location(path5, file$2, 223, 12, 9837);
    			attr_dev(path6, "class", "fill-main-color");
    			attr_dev(path6, "id", "path136");
    			set_style(path6, "fill-rule", "nonzero");
    			set_style(path6, "stroke", "none");
    			attr_dev(path6, "d", "m 4166.27,3863.96 c 0,-166.96 -135.35,-302.3 -302.31,-302.3\n              -166.95,0 -302.3,135.34 -302.3,302.3 0,166.96 135.35,302.31\n              302.3,302.31 166.96,0 302.31,-135.35 302.31,-302.31");
    			add_location(path6, file$2, 233, 12, 10427);
    			attr_dev(g3, "transform", "scale(0.1)");
    			attr_dev(g3, "id", "g130");
    			add_location(g3, file$2, 183, 10, 7035);
    			attr_dev(g4, "transform", "matrix(1.3333333,0,0,-1.3333333,0,671.78667)");
    			attr_dev(g4, "id", "g128");
    			add_location(g4, file$2, 182, 8, 6954);
    			attr_dev(svg2, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "aria-labelledby", "InstagramTitle");
    			attr_dev(svg2, "class", "external-logo svelte-iqzt2l");
    			attr_dev(svg2, "xmlns:dc", "http://purl.org/dc/elements/1.1/");
    			attr_dev(svg2, "xmlns:cc", "http://creativecommons.org/ns#");
    			attr_dev(svg2, "xmlns:rdf", "http://www.w3.org/1999/02/22-rdf-syntax-ns#");
    			attr_dev(svg2, "xmlns:svg", "http://www.w3.org/2000/svg");
    			attr_dev(svg2, "role", "img");
    			attr_dev(svg2, "viewBox", "0 0 671.78668 671.78668");
    			attr_dev(svg2, "height", "671.78668");
    			attr_dev(svg2, "width", "671.78668");
    			attr_dev(svg2, "xml:space", "preserve");
    			attr_dev(svg2, "id", "svg120");
    			attr_dev(svg2, "version", "1.1");
    			add_location(svg2, file$2, 163, 6, 6273);
    			attr_dev(a2, "href", "https://www.instagram.com/bio.tarik/");
    			add_location(a2, file$2, 162, 4, 6219);
    			attr_dev(div, "id", "logos");
    			attr_dev(div, "class", "svelte-iqzt2l");
    			add_location(div, file$2, 55, 2, 1002);
    			attr_dev(section, "class", section_class_value = "" + (null_to_empty(/*sectionId*/ ctx[0]) + " svelte-iqzt2l"));
    			add_location(section, file$2, 53, 0, 919);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(sectiontitle, section, null);
    			append_dev(section, t0);
    			append_dev(section, div);
    			append_dev(div, a0);
    			append_dev(a0, svg0);
    			append_dev(svg0, title0);
    			append_dev(title0, t1);
    			append_dev(svg0, defs0);
    			append_dev(svg0, g0);
    			append_dev(g0, path0);
    			append_dev(div, t2);
    			append_dev(div, a1);
    			append_dev(a1, svg1);
    			append_dev(svg1, title1);
    			append_dev(title1, t3);
    			append_dev(svg1, defs1);
    			append_dev(svg1, g2);
    			append_dev(g2, g1);
    			append_dev(g1, path1);
    			append_dev(g1, path2);
    			append_dev(g1, path3);
    			append_dev(div, t4);
    			append_dev(div, a2);
    			append_dev(a2, svg2);
    			append_dev(svg2, title2);
    			append_dev(title2, t5);
    			append_dev(svg2, defs2);
    			append_dev(svg2, g4);
    			append_dev(g4, g3);
    			append_dev(g3, path4);
    			append_dev(g3, path5);
    			append_dev(g3, path6);
    			append_dev(section, t6);
    			mount_component(emailform, section, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectiontitle_changes = {};
    			if (dirty & /*sectionId*/ 1) sectiontitle_changes.id = /*sectionId*/ ctx[0];
    			if (dirty & /*heading*/ 2) sectiontitle_changes.text = /*heading*/ ctx[1];
    			sectiontitle.$set(sectiontitle_changes);
    			const emailform_changes = {};
    			if (dirty & /*nameLabel*/ 4) emailform_changes.nameLabel = /*nameLabel*/ ctx[2];
    			if (dirty & /*emailLabel*/ 8) emailform_changes.emailLabel = /*emailLabel*/ ctx[3];
    			if (dirty & /*messageLabel*/ 16) emailform_changes.messageLabel = /*messageLabel*/ ctx[4];
    			if (dirty & /*sendButton*/ 32) emailform_changes.sendButton = /*sendButton*/ ctx[5];
    			if (dirty & /*okMessage*/ 64) emailform_changes.okMessage = /*okMessage*/ ctx[6];
    			if (dirty & /*errorMessage*/ 128) emailform_changes.errorMessage = /*errorMessage*/ ctx[7];
    			emailform.$set(emailform_changes);

    			if (!current || dirty & /*sectionId*/ 1 && section_class_value !== (section_class_value = "" + (null_to_empty(/*sectionId*/ ctx[0]) + " svelte-iqzt2l"))) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			transition_in(emailform.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			transition_out(emailform.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(sectiontitle);
    			destroy_component(emailform);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { sectionId } = $$props;
    	let { heading } = $$props;
    	let { nameLabel } = $$props;
    	let { emailLabel } = $$props;
    	let { messageLabel } = $$props;
    	let { sendButton } = $$props;
    	let { okMessage } = $$props;
    	let { errorMessage } = $$props;

    	const writable_props = [
    		"sectionId",
    		"heading",
    		"nameLabel",
    		"emailLabel",
    		"messageLabel",
    		"sendButton",
    		"okMessage",
    		"errorMessage"
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Contact> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Contact", $$slots, []);

    	$$self.$set = $$props => {
    		if ("sectionId" in $$props) $$invalidate(0, sectionId = $$props.sectionId);
    		if ("heading" in $$props) $$invalidate(1, heading = $$props.heading);
    		if ("nameLabel" in $$props) $$invalidate(2, nameLabel = $$props.nameLabel);
    		if ("emailLabel" in $$props) $$invalidate(3, emailLabel = $$props.emailLabel);
    		if ("messageLabel" in $$props) $$invalidate(4, messageLabel = $$props.messageLabel);
    		if ("sendButton" in $$props) $$invalidate(5, sendButton = $$props.sendButton);
    		if ("okMessage" in $$props) $$invalidate(6, okMessage = $$props.okMessage);
    		if ("errorMessage" in $$props) $$invalidate(7, errorMessage = $$props.errorMessage);
    	};

    	$$self.$capture_state = () => ({
    		sectionId,
    		heading,
    		nameLabel,
    		emailLabel,
    		messageLabel,
    		sendButton,
    		okMessage,
    		errorMessage,
    		SectionTitle,
    		EmailForm
    	});

    	$$self.$inject_state = $$props => {
    		if ("sectionId" in $$props) $$invalidate(0, sectionId = $$props.sectionId);
    		if ("heading" in $$props) $$invalidate(1, heading = $$props.heading);
    		if ("nameLabel" in $$props) $$invalidate(2, nameLabel = $$props.nameLabel);
    		if ("emailLabel" in $$props) $$invalidate(3, emailLabel = $$props.emailLabel);
    		if ("messageLabel" in $$props) $$invalidate(4, messageLabel = $$props.messageLabel);
    		if ("sendButton" in $$props) $$invalidate(5, sendButton = $$props.sendButton);
    		if ("okMessage" in $$props) $$invalidate(6, okMessage = $$props.okMessage);
    		if ("errorMessage" in $$props) $$invalidate(7, errorMessage = $$props.errorMessage);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		sectionId,
    		heading,
    		nameLabel,
    		emailLabel,
    		messageLabel,
    		sendButton,
    		okMessage,
    		errorMessage
    	];
    }

    class Contact extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
    			sectionId: 0,
    			heading: 1,
    			nameLabel: 2,
    			emailLabel: 3,
    			messageLabel: 4,
    			sendButton: 5,
    			okMessage: 6,
    			errorMessage: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Contact",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sectionId*/ ctx[0] === undefined && !("sectionId" in props)) {
    			console.warn("<Contact> was created without expected prop 'sectionId'");
    		}

    		if (/*heading*/ ctx[1] === undefined && !("heading" in props)) {
    			console.warn("<Contact> was created without expected prop 'heading'");
    		}

    		if (/*nameLabel*/ ctx[2] === undefined && !("nameLabel" in props)) {
    			console.warn("<Contact> was created without expected prop 'nameLabel'");
    		}

    		if (/*emailLabel*/ ctx[3] === undefined && !("emailLabel" in props)) {
    			console.warn("<Contact> was created without expected prop 'emailLabel'");
    		}

    		if (/*messageLabel*/ ctx[4] === undefined && !("messageLabel" in props)) {
    			console.warn("<Contact> was created without expected prop 'messageLabel'");
    		}

    		if (/*sendButton*/ ctx[5] === undefined && !("sendButton" in props)) {
    			console.warn("<Contact> was created without expected prop 'sendButton'");
    		}

    		if (/*okMessage*/ ctx[6] === undefined && !("okMessage" in props)) {
    			console.warn("<Contact> was created without expected prop 'okMessage'");
    		}

    		if (/*errorMessage*/ ctx[7] === undefined && !("errorMessage" in props)) {
    			console.warn("<Contact> was created without expected prop 'errorMessage'");
    		}
    	}

    	get sectionId() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sectionId(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get nameLabel() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set nameLabel(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get emailLabel() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set emailLabel(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get messageLabel() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set messageLabel(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sendButton() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sendButton(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get okMessage() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set okMessage(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get errorMessage() {
    		throw new Error("<Contact>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set errorMessage(value) {
    		throw new Error("<Contact>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function fade(node, { delay = 0, duration = 400, easing = identity }) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }

    /* src/components/Home.svelte generated by Svelte v3.24.0 */
    const file$3 = "src/components/Home.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (32:6) {#each heading as text, i}
    function create_each_block(ctx) {
    	let h1;
    	let t_value = /*text*/ ctx[3] + "";
    	let t;
    	let h1_transition;
    	let current;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			t = text(t_value);
    			attr_dev(h1, "class", "name mainColor svelte-1fwglai");
    			add_location(h1, file$3, 32, 8, 574);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    			append_dev(h1, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*heading*/ 1) && t_value !== (t_value = /*text*/ ctx[3] + "")) set_data_dev(t, t_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fade, { duration: 500, delay: 500 * /*i*/ ctx[5] }, true);
    				h1_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!h1_transition) h1_transition = create_bidirectional_transition(h1, fade, { duration: 500, delay: 500 * /*i*/ ctx[5] }, false);
    			h1_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    			if (detaching && h1_transition) h1_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(32:6) {#each heading as text, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let section;
    	let div;
    	let span;
    	let t0;
    	let p;
    	let t1;
    	let p_transition;
    	let section_class_value;
    	let current;
    	let each_value = /*heading*/ ctx[0];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			div = element("div");
    			span = element("span");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t0 = space();
    			p = element("p");
    			t1 = text(/*paragraph*/ ctx[1]);
    			attr_dev(span, "class", "svelte-1fwglai");
    			add_location(span, file$3, 30, 4, 526);
    			attr_dev(p, "id", "title");
    			attr_dev(p, "class", " svelte-1fwglai");
    			add_location(p, file$3, 35, 4, 699);
    			attr_dev(div, "class", "home svelte-1fwglai");
    			add_location(div, file$3, 29, 2, 503);
    			attr_dev(section, "id", /*sectionId*/ ctx[2]);
    			attr_dev(section, "class", section_class_value = "" + (/*sectionId*/ ctx[2] + " bg-main-color font-secondary-color" + " svelte-1fwglai"));
    			add_location(section, file$3, 28, 0, 421);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			append_dev(section, div);
    			append_dev(div, span);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(span, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, p);
    			append_dev(p, t1);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*heading*/ 1) {
    				each_value = /*heading*/ ctx[0];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(span, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*paragraph*/ 2) set_data_dev(t1, /*paragraph*/ ctx[1]);

    			if (!current || dirty & /*sectionId*/ 4) {
    				attr_dev(section, "id", /*sectionId*/ ctx[2]);
    			}

    			if (!current || dirty & /*sectionId*/ 4 && section_class_value !== (section_class_value = "" + (/*sectionId*/ ctx[2] + " bg-main-color font-secondary-color" + " svelte-1fwglai"))) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 500, delay: 1000 }, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 500, delay: 1000 }, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_each(each_blocks, detaching);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let { heading } = $$props;
    	let { paragraph } = $$props;
    	let { sectionId } = $$props;
    	const writable_props = ["heading", "paragraph", "sectionId"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Home> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Home", $$slots, []);

    	$$self.$set = $$props => {
    		if ("heading" in $$props) $$invalidate(0, heading = $$props.heading);
    		if ("paragraph" in $$props) $$invalidate(1, paragraph = $$props.paragraph);
    		if ("sectionId" in $$props) $$invalidate(2, sectionId = $$props.sectionId);
    	};

    	$$self.$capture_state = () => ({ fade, heading, paragraph, sectionId });

    	$$self.$inject_state = $$props => {
    		if ("heading" in $$props) $$invalidate(0, heading = $$props.heading);
    		if ("paragraph" in $$props) $$invalidate(1, paragraph = $$props.paragraph);
    		if ("sectionId" in $$props) $$invalidate(2, sectionId = $$props.sectionId);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [heading, paragraph, sectionId];
    }

    class Home extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { heading: 0, paragraph: 1, sectionId: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Home",
    			options,
    			id: create_fragment$3.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*heading*/ ctx[0] === undefined && !("heading" in props)) {
    			console.warn("<Home> was created without expected prop 'heading'");
    		}

    		if (/*paragraph*/ ctx[1] === undefined && !("paragraph" in props)) {
    			console.warn("<Home> was created without expected prop 'paragraph'");
    		}

    		if (/*sectionId*/ ctx[2] === undefined && !("sectionId" in props)) {
    			console.warn("<Home> was created without expected prop 'sectionId'");
    		}
    	}

    	get heading() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paragraph() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paragraph(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get sectionId() {
    		throw new Error("<Home>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sectionId(value) {
    		throw new Error("<Home>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Nav/Lang.svelte generated by Svelte v3.24.0 */
    const file$4 = "src/components/Nav/Lang.svelte";

    function create_fragment$4(ctx) {
    	let div;
    	let button0;
    	let t1;
    	let button1;
    	let t3;
    	let button2;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button0 = element("button");
    			button0.textContent = "PT";
    			t1 = space();
    			button1 = element("button");
    			button1.textContent = "EN";
    			t3 = space();
    			button2 = element("button");
    			button2.textContent = "IT";
    			attr_dev(button0, "class", "cursor-pointer svelte-1uwtnyw");
    			attr_dev(button0, "data-cy", "switch-lang-button");
    			add_location(button0, file$4, 26, 2, 469);
    			attr_dev(button1, "class", "cursor-pointer svelte-1uwtnyw");
    			attr_dev(button1, "data-cy", "switch-lang-button");
    			add_location(button1, file$4, 32, 2, 597);
    			attr_dev(button2, "class", "cursor-pointer svelte-1uwtnyw");
    			attr_dev(button2, "data-cy", "switch-lang-button");
    			add_location(button2, file$4, 38, 2, 725);
    			add_location(div, file$4, 25, 0, 461);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button0);
    			append_dev(div, t1);
    			append_dev(div, button1);
    			append_dev(div, t3);
    			append_dev(div, button2);

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[0], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[1], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[2], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	onMount(() => {
    		switchLang(navigator.language.split("-")[0]);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Lang> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Lang", $$slots, []);
    	const click_handler = () => switchLang("pt");
    	const click_handler_1 = () => switchLang("en");
    	const click_handler_2 = () => switchLang("it");
    	$$self.$capture_state = () => ({ switchLang, lang, onMount });
    	return [click_handler, click_handler_1, click_handler_2];
    }

    class Lang extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Lang",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/components/Nav/Menu.svelte generated by Svelte v3.24.0 */
    const file$5 = "src/components/Nav/Menu.svelte";

    function create_fragment$5(ctx) {
    	let a0;
    	let t1;
    	let ul;
    	let li0;
    	let a1;
    	let t3;
    	let li1;
    	let a2;
    	let t5;
    	let li2;
    	let a3;
    	let t7;
    	let li3;
    	let a4;
    	let t9;
    	let li4;
    	let lang;
    	let current;
    	let mounted;
    	let dispose;
    	lang = new Lang({ $$inline: true });

    	const block = {
    		c: function create() {
    			a0 = element("a");
    			a0.textContent = "☰";
    			t1 = space();
    			ul = element("ul");
    			li0 = element("li");
    			a1 = element("a");
    			a1.textContent = "Home";
    			t3 = space();
    			li1 = element("li");
    			a2 = element("a");
    			a2.textContent = "Profile";
    			t5 = space();
    			li2 = element("li");
    			a3 = element("a");
    			a3.textContent = "Skills";
    			t7 = space();
    			li3 = element("li");
    			a4 = element("a");
    			a4.textContent = "Contact";
    			t9 = space();
    			li4 = element("li");
    			create_component(lang.$$.fragment);
    			attr_dev(a0, "href", "javascript:void(0);");
    			attr_dev(a0, "class", "icon svelte-1m4djc2");
    			add_location(a0, file$5, 46, 0, 570);
    			attr_dev(a1, "href", "#home");
    			attr_dev(a1, "class", "svelte-1m4djc2");
    			add_location(a1, file$5, 54, 4, 716);
    			attr_dev(li0, "class", "svelte-1m4djc2");
    			add_location(li0, file$5, 53, 2, 707);
    			attr_dev(a2, "href", "#perfil");
    			attr_dev(a2, "class", "svelte-1m4djc2");
    			add_location(a2, file$5, 57, 4, 760);
    			attr_dev(li1, "class", "svelte-1m4djc2");
    			add_location(li1, file$5, 56, 2, 751);
    			attr_dev(a3, "href", "#competencias");
    			attr_dev(a3, "class", "svelte-1m4djc2");
    			add_location(a3, file$5, 60, 4, 809);
    			attr_dev(li2, "class", "svelte-1m4djc2");
    			add_location(li2, file$5, 59, 2, 800);
    			attr_dev(a4, "href", "#contato");
    			attr_dev(a4, "class", "svelte-1m4djc2");
    			add_location(a4, file$5, 63, 4, 863);
    			attr_dev(li3, "class", "svelte-1m4djc2");
    			add_location(li3, file$5, 62, 2, 854);
    			attr_dev(li4, "class", "language svelte-1m4djc2");
    			add_location(li4, file$5, 65, 2, 904);
    			attr_dev(ul, "class", "menu-items svelte-1m4djc2");
    			toggle_class(ul, "responsive", /*openedMenu*/ ctx[0]);
    			add_location(ul, file$5, 52, 0, 651);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, ul, anchor);
    			append_dev(ul, li0);
    			append_dev(li0, a1);
    			append_dev(ul, t3);
    			append_dev(ul, li1);
    			append_dev(li1, a2);
    			append_dev(ul, t5);
    			append_dev(ul, li2);
    			append_dev(li2, a3);
    			append_dev(ul, t7);
    			append_dev(ul, li3);
    			append_dev(li3, a4);
    			append_dev(ul, t9);
    			append_dev(ul, li4);
    			mount_component(lang, li4, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a0, "click", /*toggleMenu*/ ctx[1], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*openedMenu*/ 1) {
    				toggle_class(ul, "responsive", /*openedMenu*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(lang.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(lang.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(ul);
    			destroy_component(lang);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	var openedMenu = false;

    	function toggleMenu() {
    		$$invalidate(0, openedMenu = !openedMenu);
    	}

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Menu> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Menu", $$slots, []);
    	$$self.$capture_state = () => ({ Lang, openedMenu, toggleMenu });

    	$$self.$inject_state = $$props => {
    		if ("openedMenu" in $$props) $$invalidate(0, openedMenu = $$props.openedMenu);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [openedMenu, toggleMenu];
    }

    class Menu extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Menu",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/components/Nav/Nav.svelte generated by Svelte v3.24.0 */
    const file$6 = "src/components/Nav/Nav.svelte";

    function create_fragment$6(ctx) {
    	let nav;
    	let menu;
    	let current;
    	menu = new Menu({ $$inline: true });

    	const block = {
    		c: function create() {
    			nav = element("nav");
    			create_component(menu.$$.fragment);
    			attr_dev(nav, "class", "svelte-1guv49g");
    			add_location(nav, file$6, 16, 0, 256);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, nav, anchor);
    			mount_component(menu, nav, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menu.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menu.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(nav);
    			destroy_component(menu);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Nav> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Nav", $$slots, []);
    	$$self.$capture_state = () => ({ Menu });
    	return [];
    }

    class Nav extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Nav",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/components/OutlineDisabler.svelte generated by Svelte v3.24.0 */

    function create_fragment$7(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$7($$self, $$props, $$invalidate) {
    	onMount(async () => {
    		var styleText = "::-moz-focus-inner{border:0 !important;}:focus{outline: none !important;";
    		var unfocus_style = document.createElement("STYLE");

    		window.unfocus = function () {
    			document.getElementsByTagName("HEAD")[0].appendChild(unfocus_style);

    			document.addEventListener("mousedown", function () {
    				unfocus_style.innerHTML = styleText + "}";
    			});

    			document.addEventListener("keydown", function () {
    				unfocus_style.innerHTML = "";
    			});
    		};

    		unfocus.style = function (style) {
    			styleText += style;
    		};

    		unfocus();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<OutlineDisabler> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("OutlineDisabler", $$slots, []);
    	$$self.$capture_state = () => ({ onMount });
    	return [];
    }

    class OutlineDisabler extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "OutlineDisabler",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/Profile.svelte generated by Svelte v3.24.0 */
    const file$7 = "src/components/Profile.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (31:4) {#each paragraph as text, i}
    function create_each_block$1(ctx) {
    	let p;
    	let html_tag;
    	let raw_value = /*text*/ ctx[3] + "";
    	let t;
    	let p_transition;
    	let current;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = space();
    			html_tag = new HtmlTag(t);
    			attr_dev(p, "class", "svelte-1cxchfj");
    			add_location(p, file$7, 31, 6, 660);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			html_tag.m(raw_value, p);
    			append_dev(p, t);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if ((!current || dirty & /*paragraph*/ 4) && raw_value !== (raw_value = /*text*/ ctx[3] + "")) html_tag.p(raw_value);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 500, delay: 500 * /*i*/ ctx[5] }, true);
    				p_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!p_transition) p_transition = create_bidirectional_transition(p, fade, { duration: 500, delay: 500 * /*i*/ ctx[5] }, false);
    			p_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			if (detaching && p_transition) p_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(31:4) {#each paragraph as text, i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let section;
    	let sectiontitle;
    	let t;
    	let div;
    	let section_class_value;
    	let current;

    	sectiontitle = new SectionTitle({
    			props: {
    				id: /*sectionId*/ ctx[0],
    				text: /*heading*/ ctx[1]
    			},
    			$$inline: true
    		});

    	let each_value = /*paragraph*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(sectiontitle.$$.fragment);
    			t = space();
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "profileText wallOfText");
    			add_location(div, file$7, 29, 2, 584);
    			attr_dev(section, "class", section_class_value = "" + (/*sectionId*/ ctx[0] + " bg-secondary-color font-main-color perfil" + " svelte-1cxchfj"));
    			add_location(section, file$7, 27, 0, 461);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(sectiontitle, section, null);
    			append_dev(section, t);
    			append_dev(section, div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectiontitle_changes = {};
    			if (dirty & /*sectionId*/ 1) sectiontitle_changes.id = /*sectionId*/ ctx[0];
    			if (dirty & /*heading*/ 2) sectiontitle_changes.text = /*heading*/ ctx[1];
    			sectiontitle.$set(sectiontitle_changes);

    			if (dirty & /*paragraph*/ 4) {
    				each_value = /*paragraph*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*sectionId*/ 1 && section_class_value !== (section_class_value = "" + (/*sectionId*/ ctx[0] + " bg-secondary-color font-main-color perfil" + " svelte-1cxchfj"))) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(sectiontitle);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let { sectionId } = $$props;
    	let { heading } = $$props;
    	let { paragraph } = $$props;
    	const writable_props = ["sectionId", "heading", "paragraph"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Profile> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Profile", $$slots, []);

    	$$self.$set = $$props => {
    		if ("sectionId" in $$props) $$invalidate(0, sectionId = $$props.sectionId);
    		if ("heading" in $$props) $$invalidate(1, heading = $$props.heading);
    		if ("paragraph" in $$props) $$invalidate(2, paragraph = $$props.paragraph);
    	};

    	$$self.$capture_state = () => ({
    		fade,
    		sectionId,
    		heading,
    		paragraph,
    		SectionTitle
    	});

    	$$self.$inject_state = $$props => {
    		if ("sectionId" in $$props) $$invalidate(0, sectionId = $$props.sectionId);
    		if ("heading" in $$props) $$invalidate(1, heading = $$props.heading);
    		if ("paragraph" in $$props) $$invalidate(2, paragraph = $$props.paragraph);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sectionId, heading, paragraph];
    }

    class Profile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { sectionId: 0, heading: 1, paragraph: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Profile",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sectionId*/ ctx[0] === undefined && !("sectionId" in props)) {
    			console.warn("<Profile> was created without expected prop 'sectionId'");
    		}

    		if (/*heading*/ ctx[1] === undefined && !("heading" in props)) {
    			console.warn("<Profile> was created without expected prop 'heading'");
    		}

    		if (/*paragraph*/ ctx[2] === undefined && !("paragraph" in props)) {
    			console.warn("<Profile> was created without expected prop 'paragraph'");
    		}
    	}

    	get sectionId() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sectionId(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get paragraph() {
    		throw new Error("<Profile>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set paragraph(value) {
    		throw new Error("<Profile>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Skills.svelte generated by Svelte v3.24.0 */
    const file$8 = "src/components/Skills.svelte";

    function create_fragment$9(ctx) {
    	let section;
    	let sectiontitle;
    	let t0;
    	let div;
    	let svg;
    	let g3;
    	let g0;
    	let text0;
    	let tspan0;
    	let t1;
    	let t2;
    	let text1;
    	let tspan1;
    	let t3;
    	let t4;
    	let text2;
    	let tspan2;
    	let t5;
    	let t6;
    	let text3;
    	let tspan3;
    	let t7;
    	let t8;
    	let text4;
    	let tspan4;
    	let t9;
    	let t10;
    	let text5;
    	let tspan5;
    	let t11;
    	let t12;
    	let text6;
    	let tspan6;
    	let t13;
    	let t14;
    	let text7;
    	let tspan7;
    	let t15;
    	let t16;
    	let text8;
    	let tspan8;
    	let t17;
    	let t18;
    	let g1;
    	let circle0;
    	let circle1;
    	let circle2;
    	let circle3;
    	let g2;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let path5;
    	let path6;
    	let path7;
    	let path8;
    	let path9;
    	let section_class_value;
    	let current;

    	sectiontitle = new SectionTitle({
    			props: {
    				id: /*sectionId*/ ctx[0],
    				text: /*heading*/ ctx[1]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			section = element("section");
    			create_component(sectiontitle.$$.fragment);
    			t0 = space();
    			div = element("div");
    			svg = svg_element("svg");
    			g3 = svg_element("g");
    			g0 = svg_element("g");
    			text0 = svg_element("text");
    			tspan0 = svg_element("tspan");
    			t1 = text(".NET");
    			t2 = space();
    			text1 = svg_element("text");
    			tspan1 = svg_element("tspan");
    			t3 = text("unit testing");
    			t4 = space();
    			text2 = svg_element("text");
    			tspan2 = svg_element("tspan");
    			t5 = text("SQL");
    			t6 = space();
    			text3 = svg_element("text");
    			tspan3 = svg_element("tspan");
    			t7 = text("git");
    			t8 = space();
    			text4 = svg_element("text");
    			tspan4 = svg_element("tspan");
    			t9 = text("AWS");
    			t10 = space();
    			text5 = svg_element("text");
    			tspan5 = svg_element("tspan");
    			t11 = text("reactJs");
    			t12 = space();
    			text6 = svg_element("text");
    			tspan6 = svg_element("tspan");
    			t13 = text("js");
    			t14 = space();
    			text7 = svg_element("text");
    			tspan7 = svg_element("tspan");
    			t15 = text("css3");
    			t16 = space();
    			text8 = svg_element("text");
    			tspan8 = svg_element("tspan");
    			t17 = text("html5");
    			t18 = space();
    			g1 = svg_element("g");
    			circle0 = svg_element("circle");
    			circle1 = svg_element("circle");
    			circle2 = svg_element("circle");
    			circle3 = svg_element("circle");
    			g2 = svg_element("g");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			path5 = svg_element("path");
    			path6 = svg_element("path");
    			path7 = svg_element("path");
    			path8 = svg_element("path");
    			path9 = svg_element("path");
    			attr_dev(tspan0, "y", "225.7892");
    			attr_dev(tspan0, "x", "32");
    			attr_dev(tspan0, "id", "tspan1424");
    			add_location(tspan0, file$8, 101, 12, 1838);
    			attr_dev(text0, "id", "text1426");
    			attr_dev(text0, "y", "225.7892");
    			attr_dev(text0, "x", "30.331917");
    			add_location(text0, file$8, 100, 10, 1769);
    			attr_dev(tspan1, "id", "tspan1432");
    			attr_dev(tspan1, "x", "56.734222");
    			attr_dev(tspan1, "y", "233.99133");
    			add_location(tspan1, file$8, 104, 12, 2000);
    			attr_dev(text1, "x", "56.734222");
    			attr_dev(text1, "y", "233.99133");
    			attr_dev(text1, "id", "text1430");
    			add_location(text1, file$8, 103, 10, 1930);
    			attr_dev(tspan2, "id", "tspan1440");
    			attr_dev(tspan2, "y", "251.66713");
    			attr_dev(tspan2, "x", "67.394913");
    			add_location(tspan2, file$8, 109, 12, 2206);
    			attr_dev(text2, "id", "text1438");
    			attr_dev(text2, "y", "251.66713");
    			attr_dev(text2, "x", "67.394913");
    			add_location(text2, file$8, 108, 10, 2136);
    			attr_dev(tspan3, "y", "273.3764");
    			attr_dev(tspan3, "x", "64.183899");
    			attr_dev(tspan3, "id", "tspan1444");
    			add_location(tspan3, file$8, 114, 12, 2402);
    			attr_dev(text3, "id", "text1446");
    			attr_dev(text3, "y", "273.3764");
    			attr_dev(text3, "x", "64.183899");
    			add_location(text3, file$8, 113, 10, 2333);
    			attr_dev(tspan4, "y", "290.80118");
    			attr_dev(tspan4, "x", "44.261005");
    			attr_dev(tspan4, "id", "tspan1448");
    			add_location(tspan4, file$8, 119, 12, 2598);
    			attr_dev(text4, "id", "text1450");
    			attr_dev(text4, "y", "290.80118");
    			attr_dev(text4, "x", "44.261005");
    			add_location(text4, file$8, 118, 10, 2528);
    			attr_dev(tspan5, "y", "290.80118");
    			attr_dev(tspan5, "x", "18.445232");
    			attr_dev(tspan5, "id", "tspan1452");
    			add_location(tspan5, file$8, 124, 12, 2795);
    			attr_dev(text5, "id", "text1454");
    			attr_dev(text5, "y", "290.80118");
    			attr_dev(text5, "x", "18.445232");
    			add_location(text5, file$8, 123, 10, 2725);
    			attr_dev(tspan6, "y", "274.43475");
    			attr_dev(tspan6, "x", "6.8035722");
    			attr_dev(tspan6, "id", "tspan1456");
    			add_location(tspan6, file$8, 129, 12, 2996);
    			attr_dev(text6, "id", "text1458");
    			attr_dev(text6, "y", "274.43475");
    			attr_dev(text6, "x", "6.8035722");
    			add_location(text6, file$8, 128, 10, 2926);
    			attr_dev(tspan7, "y", "251.60512");
    			attr_dev(tspan7, "x", "-2.0410736");
    			attr_dev(tspan7, "id", "tspan1460");
    			add_location(tspan7, file$8, 134, 12, 3193);
    			attr_dev(text7, "id", "text1462");
    			attr_dev(text7, "y", "251.60512");
    			attr_dev(text7, "x", "-2.0410736");
    			add_location(text7, file$8, 133, 10, 3122);
    			attr_dev(tspan8, "y", "232.82347");
    			attr_dev(tspan8, "x", "7.2949409");
    			attr_dev(tspan8, "id", "tspan1464");
    			add_location(tspan8, file$8, 139, 12, 3392);
    			attr_dev(text8, "id", "text1466");
    			attr_dev(text8, "y", "232.82347");
    			attr_dev(text8, "x", "7.2949409");
    			add_location(text8, file$8, 138, 10, 3322);
    			attr_dev(g0, "id", "text-group");
    			attr_dev(g0, "class", "fill-main-color main-font svelte-bkz1hm");
    			add_location(g0, file$8, 99, 8, 1705);
    			attr_dev(circle0, "id", "path1422");
    			attr_dev(circle0, "cx", "39.6875");
    			attr_dev(circle0, "cy", "257.31247");
    			attr_dev(circle0, "r", "30.200096");
    			attr_dev(circle0, "class", "svelte-bkz1hm");
    			add_location(circle0, file$8, 145, 10, 3606);
    			attr_dev(circle1, "id", "circle1480");
    			attr_dev(circle1, "cx", "39.6875");
    			attr_dev(circle1, "cy", "257.31247");
    			attr_dev(circle1, "r", "23.634857");
    			attr_dev(circle1, "class", "svelte-bkz1hm");
    			add_location(circle1, file$8, 151, 10, 3752);
    			attr_dev(circle2, "r", "17.06962");
    			attr_dev(circle2, "cy", "257.31247");
    			attr_dev(circle2, "cx", "39.6875");
    			attr_dev(circle2, "id", "circle1478");
    			attr_dev(circle2, "class", "svelte-bkz1hm");
    			add_location(circle2, file$8, 157, 10, 3900);
    			attr_dev(circle3, "id", "circle1476");
    			attr_dev(circle3, "cx", "39.6875");
    			attr_dev(circle3, "cy", "257.31247");
    			attr_dev(circle3, "r", "10.504381");
    			attr_dev(circle3, "class", "svelte-bkz1hm");
    			add_location(circle3, file$8, 163, 10, 4047);
    			attr_dev(g1, "transform", "translate(-2.6458334)");
    			attr_dev(g1, "id", "circleGroup");
    			add_location(g1, file$8, 144, 8, 3532);
    			attr_dev(path0, "d", "M 39.6875,257.31248 39.692,227.03377");
    			attr_dev(path0, "id", "path1496");
    			add_location(path0, file$8, 171, 10, 4279);
    			attr_dev(path1, "id", "path1498");
    			attr_dev(path1, "d", "m 39.6875,257.31248 19.350704,-23.1783");
    			add_location(path1, file$8, 175, 10, 4398);
    			attr_dev(path2, "id", "path1500");
    			attr_dev(path2, "d", "M 39.6875,257.31248 20.38409,234.09833");
    			add_location(path2, file$8, 179, 10, 4519);
    			attr_dev(path3, "id", "path1502");
    			attr_dev(path3, "d", "M 39.6875,257.31248 9.9213683,251.76472");
    			add_location(path3, file$8, 183, 10, 4640);
    			attr_dev(path4, "d", "M 39.673981,257.33714 13.40317,272.39187");
    			attr_dev(path4, "id", "path6016");
    			add_location(path4, file$8, 187, 10, 4762);
    			attr_dev(path5, "id", "path6018");
    			attr_dev(path5, "d", "M 39.6875,257.31248 29.214066,285.76732");
    			add_location(path5, file$8, 191, 10, 4885);
    			attr_dev(path6, "d", "m 39.6875,257.31248 10.501982,28.58297");
    			attr_dev(path6, "id", "path6020");
    			add_location(path6, file$8, 195, 10, 5007);
    			attr_dev(path7, "id", "path6022");
    			attr_dev(path7, "d", "m 39.6875,257.31248 26.407053,15.12856");
    			add_location(path7, file$8, 199, 10, 5128);
    			attr_dev(path8, "id", "path6026");
    			attr_dev(path8, "d", "m 39.6875,257.31248 29.798372,-5.41337");
    			add_location(path8, file$8, 203, 10, 5249);
    			attr_dev(g2, "transform", "translate(-2.6458334)");
    			attr_dev(g2, "id", "pathsGroup");
    			attr_dev(g2, "class", "svelte-bkz1hm");
    			add_location(g2, file$8, 170, 8, 4206);
    			attr_dev(path9, "id", "amoeba");
    			attr_dev(path9, "d", "m 50.518134,241.13449 c 0.986481,1.64244 0.615675,11.6237\n          1.275744,13.6157 0.660066,1.992 9.406179,15.51938 8.625253,16.26416\n          -0.780922,0.74476 -18.572056,-4.75317 -20.339123,-5.09269\n          -1.767065,-0.3395 -4.746796,-0.13752 -6.166861,0 -1.420064,0.13753\n          -14.35319,2.80775 -15.134114,2.063 -0.780925,-0.74479\n          2.849621,-11.75392 3.42024,-13.23447 0.570618,-1.48057\n          4.152563,-7.33147 5.139048,-8.97392 0.986487,-1.64247\n          8.112936,-15.35345 9.658257,-15.66289 1.545318,-0.30946\n          12.535068,9.37866 13.521556,11.02111");
    			attr_dev(path9, "class", "shape fill-detail-color stroke-detail-color svelte-bkz1hm");
    			add_location(path9, file$8, 208, 8, 5381);
    			attr_dev(g3, "transform", "translate(3.173821,-221.29128)");
    			attr_dev(g3, "id", "layer1");
    			add_location(g3, file$8, 98, 6, 1638);
    			attr_dev(svg, "id", "svgGraph");
    			attr_dev(svg, "viewBox", "0 0 90.106551 70.874156");
    			attr_dev(svg, "height", "267.87082");
    			attr_dev(svg, "width", "340.56021");
    			attr_dev(svg, "class", "svelte-bkz1hm");
    			add_location(svg, file$8, 93, 4, 1517);
    			attr_dev(div, "class", "graph-wrapper svelte-bkz1hm");
    			add_location(div, file$8, 92, 2, 1485);
    			attr_dev(section, "class", section_class_value = "" + (/*sectionId*/ ctx[0] + " skills" + " svelte-bkz1hm"));
    			add_location(section, file$8, 90, 0, 1397);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, section, anchor);
    			mount_component(sectiontitle, section, null);
    			append_dev(section, t0);
    			append_dev(section, div);
    			append_dev(div, svg);
    			append_dev(svg, g3);
    			append_dev(g3, g0);
    			append_dev(g0, text0);
    			append_dev(text0, tspan0);
    			append_dev(tspan0, t1);
    			append_dev(text0, t2);
    			append_dev(g0, text1);
    			append_dev(text1, tspan1);
    			append_dev(tspan1, t3);
    			append_dev(text1, t4);
    			append_dev(g0, text2);
    			append_dev(text2, tspan2);
    			append_dev(tspan2, t5);
    			append_dev(text2, t6);
    			append_dev(g0, text3);
    			append_dev(text3, tspan3);
    			append_dev(tspan3, t7);
    			append_dev(text3, t8);
    			append_dev(g0, text4);
    			append_dev(text4, tspan4);
    			append_dev(tspan4, t9);
    			append_dev(text4, t10);
    			append_dev(g0, text5);
    			append_dev(text5, tspan5);
    			append_dev(tspan5, t11);
    			append_dev(text5, t12);
    			append_dev(g0, text6);
    			append_dev(text6, tspan6);
    			append_dev(tspan6, t13);
    			append_dev(text6, t14);
    			append_dev(g0, text7);
    			append_dev(text7, tspan7);
    			append_dev(tspan7, t15);
    			append_dev(text7, t16);
    			append_dev(g0, text8);
    			append_dev(text8, tspan8);
    			append_dev(tspan8, t17);
    			append_dev(text8, t18);
    			append_dev(g3, g1);
    			append_dev(g1, circle0);
    			append_dev(g1, circle1);
    			append_dev(g1, circle2);
    			append_dev(g1, circle3);
    			append_dev(g3, g2);
    			append_dev(g2, path0);
    			append_dev(g2, path1);
    			append_dev(g2, path2);
    			append_dev(g2, path3);
    			append_dev(g2, path4);
    			append_dev(g2, path5);
    			append_dev(g2, path6);
    			append_dev(g2, path7);
    			append_dev(g2, path8);
    			append_dev(g3, path9);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const sectiontitle_changes = {};
    			if (dirty & /*sectionId*/ 1) sectiontitle_changes.id = /*sectionId*/ ctx[0];
    			if (dirty & /*heading*/ 2) sectiontitle_changes.text = /*heading*/ ctx[1];
    			sectiontitle.$set(sectiontitle_changes);

    			if (!current || dirty & /*sectionId*/ 1 && section_class_value !== (section_class_value = "" + (/*sectionId*/ ctx[0] + " skills" + " svelte-bkz1hm"))) {
    				attr_dev(section, "class", section_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(sectiontitle.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(sectiontitle.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(section);
    			destroy_component(sectiontitle);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { sectionId } = $$props;
    	let { heading } = $$props;
    	const writable_props = ["sectionId", "heading"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Skills> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("Skills", $$slots, []);

    	$$self.$set = $$props => {
    		if ("sectionId" in $$props) $$invalidate(0, sectionId = $$props.sectionId);
    		if ("heading" in $$props) $$invalidate(1, heading = $$props.heading);
    	};

    	$$self.$capture_state = () => ({ sectionId, heading, SectionTitle });

    	$$self.$inject_state = $$props => {
    		if ("sectionId" in $$props) $$invalidate(0, sectionId = $$props.sectionId);
    		if ("heading" in $$props) $$invalidate(1, heading = $$props.heading);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [sectionId, heading];
    }

    class Skills extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { sectionId: 0, heading: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Skills",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*sectionId*/ ctx[0] === undefined && !("sectionId" in props)) {
    			console.warn("<Skills> was created without expected prop 'sectionId'");
    		}

    		if (/*heading*/ ctx[1] === undefined && !("heading" in props)) {
    			console.warn("<Skills> was created without expected prop 'heading'");
    		}
    	}

    	get sectionId() {
    		throw new Error("<Skills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set sectionId(value) {
    		throw new Error("<Skills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get heading() {
    		throw new Error("<Skills>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set heading(value) {
    		throw new Error("<Skills>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/App.svelte generated by Svelte v3.24.0 */
    const file$9 = "src/App.svelte";

    function create_fragment$a(ctx) {
    	let main;
    	let outlinedisabler;
    	let t0;
    	let nav;
    	let t1;
    	let home;
    	let t2;
    	let profile;
    	let t3;
    	let skills;
    	let t4;
    	let contact;
    	let current;
    	outlinedisabler = new OutlineDisabler({ $$inline: true });
    	nav = new Nav({ $$inline: true });
    	const home_spread_levels = [/*$i18n*/ ctx[0]`home`];
    	let home_props = {};

    	for (let i = 0; i < home_spread_levels.length; i += 1) {
    		home_props = assign(home_props, home_spread_levels[i]);
    	}

    	home = new Home({ props: home_props, $$inline: true });
    	const profile_spread_levels = [/*$i18n*/ ctx[0]`profile`];
    	let profile_props = {};

    	for (let i = 0; i < profile_spread_levels.length; i += 1) {
    		profile_props = assign(profile_props, profile_spread_levels[i]);
    	}

    	profile = new Profile({ props: profile_props, $$inline: true });
    	const skills_spread_levels = [/*$i18n*/ ctx[0]`skills`];
    	let skills_props = {};

    	for (let i = 0; i < skills_spread_levels.length; i += 1) {
    		skills_props = assign(skills_props, skills_spread_levels[i]);
    	}

    	skills = new Skills({ props: skills_props, $$inline: true });
    	const contact_spread_levels = [/*$i18n*/ ctx[0]`contact`];
    	let contact_props = {};

    	for (let i = 0; i < contact_spread_levels.length; i += 1) {
    		contact_props = assign(contact_props, contact_spread_levels[i]);
    	}

    	contact = new Contact({ props: contact_props, $$inline: true });

    	const block = {
    		c: function create() {
    			main = element("main");
    			create_component(outlinedisabler.$$.fragment);
    			t0 = space();
    			create_component(nav.$$.fragment);
    			t1 = space();
    			create_component(home.$$.fragment);
    			t2 = space();
    			create_component(profile.$$.fragment);
    			t3 = space();
    			create_component(skills.$$.fragment);
    			t4 = space();
    			create_component(contact.$$.fragment);
    			add_location(main, file$9, 14, 0, 466);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(outlinedisabler, main, null);
    			append_dev(main, t0);
    			mount_component(nav, main, null);
    			append_dev(main, t1);
    			mount_component(home, main, null);
    			append_dev(main, t2);
    			mount_component(profile, main, null);
    			append_dev(main, t3);
    			mount_component(skills, main, null);
    			append_dev(main, t4);
    			mount_component(contact, main, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const home_changes = (dirty & /*$i18n*/ 1)
    			? get_spread_update(home_spread_levels, [get_spread_object(/*$i18n*/ ctx[0]`home`)])
    			: {};

    			home.$set(home_changes);

    			const profile_changes = (dirty & /*$i18n*/ 1)
    			? get_spread_update(profile_spread_levels, [get_spread_object(/*$i18n*/ ctx[0]`profile`)])
    			: {};

    			profile.$set(profile_changes);

    			const skills_changes = (dirty & /*$i18n*/ 1)
    			? get_spread_update(skills_spread_levels, [get_spread_object(/*$i18n*/ ctx[0]`skills`)])
    			: {};

    			skills.$set(skills_changes);

    			const contact_changes = (dirty & /*$i18n*/ 1)
    			? get_spread_update(contact_spread_levels, [get_spread_object(/*$i18n*/ ctx[0]`contact`)])
    			: {};

    			contact.$set(contact_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(outlinedisabler.$$.fragment, local);
    			transition_in(nav.$$.fragment, local);
    			transition_in(home.$$.fragment, local);
    			transition_in(profile.$$.fragment, local);
    			transition_in(skills.$$.fragment, local);
    			transition_in(contact.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(outlinedisabler.$$.fragment, local);
    			transition_out(nav.$$.fragment, local);
    			transition_out(home.$$.fragment, local);
    			transition_out(profile.$$.fragment, local);
    			transition_out(skills.$$.fragment, local);
    			transition_out(contact.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(outlinedisabler);
    			destroy_component(nav);
    			destroy_component(home);
    			destroy_component(profile);
    			destroy_component(skills);
    			destroy_component(contact);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let $i18n;
    	validate_store(i18n, "i18n");
    	component_subscribe($$self, i18n, $$value => $$invalidate(0, $i18n = $$value));
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	let { $$slots = {}, $$scope } = $$props;
    	validate_slots("App", $$slots, []);

    	$$self.$capture_state = () => ({
    		i18n,
    		Contact,
    		Home,
    		Nav,
    		OutlineDisabler,
    		Profile,
    		Skills,
    		$i18n
    	});

    	return [$i18n];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$a.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    	},
    	intro: true
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
