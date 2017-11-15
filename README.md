FlappyBirdRL
============

Flappy Bird hack using Reinforcement Learning


You can view a summary of the game and the algorithm here! <link>http://SarvagyaVaish.github.io/FlappyBirdRL</link>


### Running the code yourself
- [Download](https://github.com/SarvagyaVaish/FlappyBirdRL/archive/master.zip) the code and unzip it
- Open a terminal and navigate to the folder

  `cd ~/Downloads/FlappyBirdRL-master`

- Start a simple server using python

  `python -m SimpleHTTPServer 8000`
  
  More details [here](https://stackoverflow.com/a/21608670/2855493).

- In a browser navigate to the local server's address (default is [0.0.0.:8000](http://0.0.0.0:8000/))


### Troubleshooting

- Did you start a server?

If you just opened the index.html page you might have an error in the console regarding origin requests. Right click anywhere on the screen, click Inspect and then look at the Console.

Does it have the following error? Example [screenshot](https://imgur.com/a/LSlET)

```Failed to load file:///Users/.../res/flappyAtlas/atlas.txt: Cross origin requests are only supported for protocol schemes: http, data, chrome, chrome-extension, https."```

**[The issue](https://stackoverflow.com/questions/10752055/cross-origin-requests-are-only-supported-for-http-error-when-loading-a-local)**: The page tries to load a file from disk but most modern browsers block that as a security risk.

**Solution**: Run a local server. Use the instructions above to start a server locally in 2 minutes.
