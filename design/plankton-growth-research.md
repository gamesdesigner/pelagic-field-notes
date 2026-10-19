# Individual-cell population lab — October 19, 2026

The tank starts with one diatom and one photosynthetic dinoflagellate. Populations remain exact integers. Each full
visible symbol represents 50 cells; the final partial symbol represents the
remaining 1–49 and shows that number. Each group is capped at 5,000 cells (100
full symbols) for the display; this is not an ecological carrying capacity.

## Primary evidence inspected

1. Gleich, S. J., Plough, L. V. & Glibert, P. M. (2020). *Photosynthetic efficiency
   and nutrient physiology of the diatom Thalassiosira pseudonana at three growth
   temperatures*. Marine Biology 167:124. DOI: 10.1007/s00227-020-03741-7.
   https://repository.library.noaa.gov/view/noaa/28801
   Full paper: https://repository.library.noaa.gov/view/noaa/28801/noaa_28801_DS1.pdf
   Results, p. 5: nutrient-replete exponential specific growth rates **0.41, 1.28,
   0.66 day^-1**, respectively at **4, 17, 28 C**. Cultures were acclimated,
   in f/2 medium, 12:12 light/dark, approximately 200 micromol photons m^-2 s^-1.
   Nutrient-depleted transfers initially retained nutrients and grew temporarily;
   exhaustion therefore does not imply instantaneous death in real cultures.

2. Matsuda, A., Nishijima, T. & Fukami, K. (1999). *Effects of Nitrogenous and
   Phosphorus Nutrients on the Growth of Toxic Dinoflagellate Alexandrium
   catenella*. Nippon Suisan Gakkaishi 65(5):847–855.
   https://www.miyagi.kopas.co.jp/JSFS/jsfs-english/E-PUB/65-5/p847.html
   The original journal abstract reports nutrient-saturated maximum specific
   growth rates **0.47–0.55 day^-1**, inorganic N half-saturation 3.3–7.7 micromolar,
   and phosphate half-saturation 0.72 micromolar. These concentration and cell-quota
   units are NOT transplanted into an arbitrary-volume classroom tank.

3. Klawonn et al. (2019). *Untangling hidden nutrient dynamics: rapid ammonium
   cycling and single-cell ammonium assimilation in marine plankton communities*.
   ISME Journal 13:1960–1974. DOI: 10.1038/s41396-019-0386-z.
   https://www.nature.com/articles/s41396-019-0386-z
   https://pmc.ncbi.nlm.nih.gov/articles/PMC6776039/
   Stable-isotope/single-cell measurements support showing dissolved nutrient
   assimilation at individual cells, not cells biting solid fertilizer grains.

4. Filipic, B. (1985). *Some Observations on the Vertical Migrations of the
   Dinoflagellate Prorocentrum micans Ehrenberg in the Lim Fjord (Northern
   Adriatic)*. Acta Botanica Croatica 44(1):33–40.
   https://hrcak.srce.hr/159158
   Field observations at four-hour intervals over 48 hours documented diel
   migration. The proposed link between nocturnal descent and deeper phosphate
   was a hypothesis, not a demonstrated universal nutrient chemotaxis law.

5. Sherr, E. B., Sherr, B. F. & Ross, C. (2013). *Microzooplankton grazing impact
   in the Bering Sea during spring sea ice conditions*. Deep-Sea Research II
   94:57–67. DOI: 10.1016/j.dsr2.2013.03.019.
   https://doi.org/10.1016/j.dsr2.2013.03.019
   Forty-nine dilution assays found strongly variable grazing: mean including
   non-significant estimates **0.09 +/- 0.10 day^-1**, maximum **0.49 day^-1**.
   These are MICROZOOPLANKTON grazing results, NOT fish-capture or starvation
   coefficients. They demonstrate why a universal fixed loss count is unsound;
   they are not used to calibrate cartoon fish.

## Mathematical implementation

A specific growth rate mu means N(t) = N(0) exp(mu t) in balanced exponential
culture growth. Divisions per day = mu / ln(2); doubling time = ln(2) / mu.
Thus 1.28 day^-1 corresponds to approximately 13 hours per doubling; 0.47–0.55
corresponds to approximately 30–35 hours. These units must not be interchanged.

`shared/plankton-model.mjs` tracks a fractional *cell-cycle phase* for each living
cell, while populations remain integers. In each of 24 hourly substeps a cell
advances by mu(T) / ln(2) times nutrient limitation / 24. At phase 1 it becomes
two daughters with phase zero. Division is resolved at the next hourly boundary,
so a fraction of an hour can be lost rather than inventing extra biomass.
Mature cells wait for space at the cap without repeatedly consuming a growth budget. Daughters can divide in subsequent
hours. Cells start synchronized; therefore the output is generational rather
than a smooth exponential curve. At 17 C with ample nutrients, the first three
daily counts are 2, 8, 32. Deaths, competition and finite nutrient budgets can
interrupt this sequence. Nothing respawns from an extinct group.

For the diatom, interpolate the three measured temperature points. Linear
extrapolation below 17 C and decline from 28 C to zero at 35 C are illustrative,
not study measurements. For the dinoflagellate, use mu_max = 0.51 day^-1 within
the reported range. Its exp(-((T-22)/12)^2) thermal multiplier is an explicit
classroom assumption; it is not a fit to that paper's thermal data.

Use the minimum resource saturation C/(C+K), N and P for both groups, plus Si
for diatoms. K = 0.8 N, 0.2 P, 0.6 Si in **invented classroom units**. Cell-cycle
progress uses 0.0036 N and 0.0009 P per cell-cycle unit, and 0.0032 Si for diatoms.
These budgets are the October 18 classroom costs divided by 50 to support the
larger experiment while retaining meaningful finite nutrient supplies. The
measured growth rates and their conversion to division frequency are unchanged.
These are teaching budgets, not measured cellular quotas or environmental units.
Patch encounters transfer 0.5 times those budgets times the target symbol weight from dissolved stock into
finite cellular reserves, capped at two cell-cycle budgets per living cell.
Daily growth draws on reserves and mixed-water supply without double counting.
Maintenance consumes 0.012 times each budget per cell/day. These costs, reserve
sizes and maintenance rates are illustrative, not fitted experimental values.

Background/stress loss rate m = 0.015 + 0.18*(1-resource limitation) +
0.04*max(0,T-30) day^-1 is explicitly illustrative. Hourly expected whole-cell
losses accumulate from N*(1-exp(-m/24)); only complete loss events remove cells.
Fish remove exactly the number represented by their target on mouth contact:
50 for a full symbol or 1–49 for a partial symbol. No additional fish losses
are hidden in the daily model. Their visible speed and max one
new capture allowance per model day (banked at most three) are display choices.
No additional daily fish deduction occurs. Lost-cell reserves leave the model;
no nutrient recycling is implied.

## Movement and representation

Dinoflagellates move toward local N/P patches as a pedagogical illustration of
nutrient-seeking motile plankton; this is not a measured chemotactic response of
the reference strain to every nutrient. The open-water diatoms do not propel
themselves: explicit pale mixing-current arrows carry them toward patches.
The flow is simplified and not a hydrodynamical solution. Silicate patches only
attract/transfer nutrients to diatoms. Cells flash during uptake. Halos disperse
in 45 animation seconds; their disappearance does not delete dissolved inventory.
Daily steps assume water mixing, so cells also take up from ambient water.
Movement, cell size, fish size and time are scaled independently for legibility.
One simulated day takes 2.5 animation seconds. Reduced motion removes swimming
and drifting but preserves cells, patch encounters and controls.

The app provides paper links and clearly distinguishes measured rates from
teaching parameters. No claims of a validated species forecast, real tank volume,
concentrations, oxygen/toxin dynamics, or universal mortality rate are made.


## Generated artwork and rendering — October 19 update

The built-in image generator created separate transparent PNG diatom and
armored dinoflagellate illustrations. Full prompts and output paths are recorded
in `design/plankton-sprite-prompts.md`; originals and optimized alpha-preserving
WebP assets live in `public/assets/plankton/`. These are labeled stylized teaching
illustrations, not microscope photographs or exact taxonomic specimens.

`planktonSymbolWeights` maps N to floor(N/50) full symbols and, if needed, a
partial symbol of weight N mod 50. No cells are rounded away or invented. A
partial symbol is faded, carries a proportional ring, and shows its exact weight.
The tank, visible scale key, chart, table, ledger, accessible descriptions and
capture accounting all use this same convention. Population arrays still model
individual cell cycles (at most 5,000 per type); animated images are capped at
100 per type, so rendering remains bounded instead of drawing 10,000 sprites.
The scale key says “1 symbol = 50 cells” for both types. The enlarged artwork
viewer preserves visible details beyond the small tank sprites.
