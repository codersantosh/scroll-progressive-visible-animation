# AT Scroll Progressive Visible Animation - JavaScript apply CSS on scroll

JavaScript scroll trigger style - apply CSS progressively on scroll or apply CSS on visible scroll.
- Pure JavaScript.
- Uses IntersectionObserver to apply any CSS on visible scroll.
- Uses window event listener scroll to apply transform CSS on scroll progressively.

A small vanilla JavaScript codes that applies CSS to elements while scrolling.

## Uses
### 1. Apply CSS on visible scroll

<strong> HTML </strong>

- should have `data-at-new-style`
- add any css properties on JSON format
```html
<div class="at-style-triggered-scroll demo-col demo-1 at-flex at-justify-content-center at-align-items-center" data-at-new-style='{"transform":"translate(200px,10px)"}'>
    <p>400*600</p>
</div>
```
<strong> Add JS `at-progressive-visible-scroll-style.js` and add JavaScript </strong>

```html
<script src="js/at-progressive-visible-scroll-style.js"></script>
<script>
    AtScrollTriggerStyle('.at-style-triggered-scroll');
</script>
```

### 2. Apply transform CSS on scroll progressively

<strong> HTML </strong>

- should have `data-at-original-style`
- should have `data-at-new-style`
- add transform css properties on JSON format on both attributes `data-at-original-style` and `data-at-new-style`
```html
<div class="at-style-progressive-scroll demo-col demo-1 at-flex at-justify-content-center at-align-items-center"
     data-at-original-style='{"transform":"translate(-100px,0px)"}' data-at-new-style='{"transform":"translate(200px,10px)"}'
>
    <p>400*600</p>
</div>
```

```html
<img
        class="at-style-progressive-scroll"
        src="https://picsum.photos/id/12/200/200"
        data-at-original-style='{"transform":"rotate(0deg)"}'
        data-at-new-style='{"transform":"rotate(45deg)"}'
        alt="progressive scroll demo rotate"
        height="200"
        width="200"
/>
```

<strong> Add JS `at-progressive-visible-scroll-style.js` and add JavaScript </strong>

```html
<script src="js/at-progressive-visible-scroll-style.js"></script>
<script>
    AtScrollProgressiveStyle('.at-style-progressive-scroll');
</script>
```
<strong> Add JS `at-progressive-visible-scroll-style.js` only once</strong>

## Examples
View style-triggered-on-visible-scroll.html for Apply CSS on visible scroll and 
progressive-style-on-scroll.html for Apply transform CSS on scroll progressively

## Demo
[View Demo](https://codersantosh.github.io/scroll-progressive-visible-animation/) or See index.html

## About Me
<strong>WordPress Engineer</strong>
<br />
<strong>I just love WordPress more…</strong>

- [![CoderSantosh on Twitter](https://img.shields.io/twitter/follow/codersantosh.svg)](https://twitter.com/codersantosh/)
- <a href="https://profiles.wordpress.org/codersantosh/" target="_blank"><img src="https://s.w.org/style/images/about/WordPress-logotype-wmark.png" width="50" height="50" />WordPress Profile</a>

