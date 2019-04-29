# flatsurf-widgets

[![Build Status](https://travis-ci.org/flatsurf/flatsurf-widgets.svg?branch=master)](https://travis-ci.org/flatsurf/flatsurf_widgets)
[![codecov](https://codecov.io/gh/flatsurf/flatsurf-widgets/branch/master/graph/badge.svg)](https://codecov.io/gh/flatsurf/flatsurf-widgets)

Jupyter Widgets for flatsurf

## Installation

Enable this extension in Jupyter Notebooks with

```bash
pip install flatsurf_widgets
```

If you use jupyterlab, you also need jupyterlab-manager

```bash
jupyter labextension install @jupyter-widgets/jupyterlab-manager
```

## Development

Development is probably best done in a dedicated conda environment

```bash
conda create -c conda-forge -n flatsurf-widgets jupyterlab ipywidgets widgetsnbextension pip 
conda activate flatsurf-widgets
```

Install the package in develop mode (changes to the Python bits are immediately
available in the site-packages, i.e., upon next module import.) When developing
for the *classical notebook*, the non-Python part needs to be updated manually
by running this command again. However, with Hot Module Reloading (see below)
this should not be necessary unless the bootstrapping JavaScript at the bottom
changes. Since we want the examples and tests to be able to run, we also
install all extra requirements that they configure in `setup.py`.

```bash
pip install -e ".[test, examples]"
```

For the *classical notebook*, we need to make our Python package available to the notebook

```bash
jupyter nbextension install --sys-prefix --symlink --overwrite --py flatsurf_widgets
jupyter nbextension enable --sys-prefix --py flatsurf_widgets
```

Start a *classical notebook*, and have a look at the files in `examples/`

```bash
jupyter notebook &
```

For *Jupyter Lab*, install the jupyterlab-manager and then *link* the
JavaScript bits of your extension so that Jupyter Lab automatically rebuilds
when they change. This only affects the bootstrapping JavaScript, the bigger
part is going to be reloaded automatically through Hot Module Reloading (see below).

```bash
jupyter labextension install @jupyter-widgets/jupyterlab-manager
jupyter labextension link .
```

Start *Jupyter Lab* and have a look at the files in `examples/`

```bash
jupyter lab &
```

If you don't want to use Hot Module Reloading, you can now start to develop your extension.

If you are working in the *classical notebook*, changes to Python code should take effect by restarting the Kernel, and when the frontend code changes, run `yarn build:nbextension` and reload your browser tab.

If you are working in *Jupyter Lab*, just reload your browser tab. A dialog should ask whether you want to rebuild (which takes a while) and then accept to reload again for the changes to take affect.

### Hot Module Reloading

At the moment only works in the classical notebook and only for notebooks
inside the examples directory (also source maps do not get updated…it's very
hacky to say the least…)

```bash
yarn webpack-dev-server --config webpack-hot.config.js --hot --progress
```

Now you should be able to modify the template of `src/Component.vue` and see
changes when you save it.
