<script>
  export let sectionId;
  export let heading;
  import SectionTitle from "./SectionTitle.svelte";
</script>

<style>
  .skills {
    color: var(--main-color);
    background-color: var(--secondary-color);
  }

  .graph-wrapper {
    margin-left: auto;
    margin-right: auto;
    max-height: 500px;
  }

  #svgGraph {
    width: 100%;
    height: 100%;
    fill: none;
    stroke-width: 0.2;
  }

  #amoeba {
    stroke-width: 1;
    fill-opacity: 0.6;
    transition: fill-opacity 0.5s;
  }

  #amoeba:hover {
    fill-opacity: 1;
  }

  #text-group {
    font-size: 4px;
    stroke: none;
  }

  circle {
    fill: rgba(51, 51, 51, 0.1);
  }

  circle:nth-child(1) {
    stroke: rgba(51, 51, 51, 0.7);
  }
  circle:nth-child(2) {
    stroke: rgba(51, 51, 51, 0.5);
  }
  circle:nth-child(3) {
    stroke: rgba(51, 51, 51, 0.3);
  }
  circle:nth-child(4) {
    stroke: rgba(51, 51, 51, 0.1);
  }

  #pathsGroup {
    stroke: rgba(51, 51, 51, 0.5);
  }

  .fill-main-color {
    fill: var(--main-color);
  }

  .stroke-main-color {
    stroke: var(--main-color);
  }

  .fill-secondary-color {
    fill: var(--secondary-color);
  }

  .stroke-secondary-color {
    stroke: var(--secondary-color);
  }

  .fill-detail-color {
    fill: var(--detail-color);
  }

  .stroke-detail-color {
    stroke: var(--detail-color);
  }

  .main-font {
    font-family: var(--main-font);
  }
</style>

<section class="{sectionId} skills">
  <SectionTitle id={sectionId} text={heading} />
  <div class="graph-wrapper">
    <svg
      id="svgGraph"
      viewBox="0 0 90.106551 70.874156"
      height="267.87082"
      width="340.56021">
      <g transform="translate(3.173821,-221.29128)" id="layer1">
        <g id="text-group" class="fill-main-color main-font">
          <text id="text1426" y="225.7892" x="30.331917" style="">
            <tspan style="" y="225.7892" x="32" id="tspan1424">.NET</tspan>
          </text>
          <text style="" x="56.734222" y="233.99133" id="text1430">
            <tspan id="tspan1432" x="56.734222" y="233.99133" style="">
              unit testing
            </tspan>
          </text>
          <text id="text1438" y="251.66713" x="67.394913" style="">
            <tspan id="tspan1440" style="" y="251.66713" x="67.394913">
              SQL
            </tspan>
          </text>
          <text id="text1446" y="273.3764" x="64.183899" style="">
            <tspan style="" y="273.3764" x="64.183899" id="tspan1444">
              git
            </tspan>
          </text>
          <text id="text1450" y="290.80118" x="44.261005" style="">
            <tspan style="" y="290.80118" x="44.261005" id="tspan1448">
              AWS
            </tspan>
          </text>
          <text id="text1454" y="290.80118" x="18.445232" style="">
            <tspan style="" y="290.80118" x="18.445232" id="tspan1452">
              reactJs
            </tspan>
          </text>
          <text id="text1458" y="274.43475" x="6.8035722" style="">
            <tspan style="" y="274.43475" x="6.8035722" id="tspan1456">
              js
            </tspan>
          </text>
          <text id="text1462" y="251.60512" x="-2.0410736" style="">
            <tspan style="" y="251.60512" x="-2.0410736" id="tspan1460">
              css3
            </tspan>
          </text>
          <text id="text1466" y="232.82347" x="7.2949409" style="">
            <tspan style="" y="232.82347" x="7.2949409" id="tspan1464">
              html5
            </tspan>
          </text>
        </g>
        <g transform="translate(-2.6458334)" style="" id="circleGroup">
          <circle
            style=""
            id="path1422"
            cx="39.6875"
            cy="257.31247"
            r="30.200096" />
          <circle
            style=""
            id="circle1480"
            cx="39.6875"
            cy="257.31247"
            r="23.634857" />
          <circle
            r="17.06962"
            cy="257.31247"
            cx="39.6875"
            id="circle1478"
            style="" />
          <circle
            style=""
            id="circle1476"
            cx="39.6875"
            cy="257.31247"
            r="10.504381" />
        </g>
        <g transform="translate(-2.6458334)" style="" id="pathsGroup">
          <path
            style=""
            d="M 39.6875,257.31248 39.692,227.03377"
            id="path1496" />
          <path
            id="path1498"
            d="m 39.6875,257.31248 19.350704,-23.1783"
            style="" />
          <path
            id="path1500"
            d="M 39.6875,257.31248 20.38409,234.09833"
            style="" />
          <path
            id="path1502"
            d="M 39.6875,257.31248 9.9213683,251.76472"
            style="" />
          <path
            style=""
            d="M 39.673981,257.33714 13.40317,272.39187"
            id="path6016" />
          <path
            id="path6018"
            d="M 39.6875,257.31248 29.214066,285.76732"
            style="" />
          <path
            style=""
            d="m 39.6875,257.31248 10.501982,28.58297"
            id="path6020" />
          <path
            id="path6022"
            d="m 39.6875,257.31248 26.407053,15.12856"
            style="" />
          <path
            id="path6026"
            d="m 39.6875,257.31248 29.798372,-5.41337"
            style="" />
        </g>
        <path
          id="amoeba"
          d="m 50.518134,241.13449 c 0.986481,1.64244 0.615675,11.6237
          1.275744,13.6157 0.660066,1.992 9.406179,15.51938 8.625253,16.26416
          -0.780922,0.74476 -18.572056,-4.75317 -20.339123,-5.09269
          -1.767065,-0.3395 -4.746796,-0.13752 -6.166861,0 -1.420064,0.13753
          -14.35319,2.80775 -15.134114,2.063 -0.780925,-0.74479
          2.849621,-11.75392 3.42024,-13.23447 0.570618,-1.48057
          4.152563,-7.33147 5.139048,-8.97392 0.986487,-1.64247
          8.112936,-15.35345 9.658257,-15.66289 1.545318,-0.30946
          12.535068,9.37866 13.521556,11.02111"
          class="shape fill-detail-color stroke-detail-color"
          style="" />
      </g>
    </svg>
  </div>
</section>
