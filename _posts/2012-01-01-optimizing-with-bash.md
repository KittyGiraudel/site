---
title: Optimizing images with Bash script
preview: true
comments: false
layout: post
---
<section>
<p>Let's try a not-so-easy exercise: write a script to optimize a directory of images. Yup, I know there are a lot of web services offering this kind of feature but:</p>
<ul>
<li>most of them can't optimize several files at once,</li>
<li>it's not quite simple to use it in an industrial process,</li>
<li>it's always interesting to learn how those services work.</li>
</ul>
<p>But first, a simple warning: don't expect big optimizations. To have the best results, you have to decrease the image quality but it's better to do this manually than automatically. We are going to script simple operations that remove metadata and other losslessly informations.</p>
<p>I'm working on Linux environment so this script will be a Bash script. Don't worry! I will start with an introduction to Bash scripting in a Windows environment.</p>
</section>
<section id="linux">
<h2>Use Linux flavour in Windows <a href='#linux'>#</a></h2>
<p>To be able to run Linux scripts in windows, there is two methods:</p>
<ul>
<li>use a Virtual Machine with a Linux distribution on it,</li>
<li>use a Linux simulator.</li>
</ul>
<p>Since it can be quite a pain to set up a virtual machine, we will go for the latter with <a href="http://www.cygwin.com/">Cygwin</a>. Cygwin is a Linux simulator. Go to the <a href="http://cygwin.com/install.html">download section</a>, grab the <code>setup.exe</code> file and execute it to launch the installer. A step of the installation process will ask you which packages to install.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__cygwin.png" alt="" />
<figcaption><a href="http://www.cygwin.com/">Cygwin</a> is a Linux simulator</figcaption>
</figure>
<p>To add a package, click on the "Skip" label to switch it to a package version. Search and add the following packages:<p>
<ul>
<li>optipng</li>
<li>pngcrush</li>
<li>jpeg</li>
<li>util-linux</li>
</ul>
<p>Once Cygwin is installed, just open a Cygwin terminal. Let's create a workspace to host our optimization script: we create a <em>"workspace"</em> directory in the current user home:</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__workspace.png" alt="" />
<figcaption>Creating a workspace in Cygwin</figcaption>
</figure>
<p>By default, Cygwin is installed at <code>C:/cygwin/</code> so our new directory is at <code>C:/cygwin/home/[username]/workspace</code>. Let's create a <em>"images"</em> directory and fill it with some random images from the wild wild web. For this exercise, we are going to take cat pictures because, you know, everybody love cats.</p>
</section>
<section id="optimization">
<h2>Optimization of an image with the command line <a href="#optimization">#</a></h2>
<p>For each file, we are going to run <em>optipng</em> and <em>pngcrush</em> for PNG files and <em>jpegtran</em> for JPG files. A first try with <em>optipng</em>:</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__optipng.png" alt="" />
<figcaption>PNG optimization with optipng</figcaption>
</figure>
<p class="note">Note: the -o7 parameter force optipng to use the slowest mode. The fastest is -o0.</p>
<p>And now <em>pngcrush</em>:</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__pngcrush.png" alt="" />
<figcaption>PNG optimization with pngcrush</figcaption>
</figure>
<p>And now a JPEG optimization with <em>jpegtran</em>:</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__jpegtran.png" alt="" />
<figcaption>JPG optimization with jpegtran</figcaption>
</figure>
</section>
<section id="script">
<h2>Let's put all this stuff in a script <a href="#script">#</a></h2>
<h3>Options parsing</h3>
<p>Our script must have some parameters:</p>
<ul>
<li>a parameter <code>-i</code> or <code>--input</code> to specify an input directory</li>
<li>a parameter <code>-o</code> or <code>--output</code> to specify an output directory</li>
<li>a parameter <code>-q</code> or <code>--quiet</code> to disable verbose output</li>
<li>a parameter <code>-ns</code> or <code>--no-stats</code> to disable the display of some stats at the end of the run</li>
<li>a parameter <code>-h</code> or <code>--help</code> to display some help</li>
</ul>
<p>There is a common pattern to parse script options, based on the <code>getopt</code> command. First, create two variables to store the short and long version of each parameter. A parameter which requires a specific value (for example our input and output directories) must end with ":".</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__options.png" alt="" />
<figcaption>Bash script options</figcaption>
</figure>
<p>Then we are going to use the <code>getopt</code> command to parse the parameters passed to script and use a loop to call functions or define variables to store values. For this, we will also need to know the script name.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__options-loop.png" alt="" />
<figcaption>Options loop</figcaption>
</figure>
<h3>Help function</h3>
<p>Now, we have to create two functions: </p>
<ul>
<li>the <code>usage()</code> function, called in the parameters loop if there is a <code>-h</code> or <code>--help</code> parameter,</li>
<li>a <code>main()</code> function which will do the optimization of the images.</li>
</ul>
<p>To be called, the functions must be declared before the parameters loop.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__usage.png" alt="" />
<figcaption>Help function</figcaption>
</figure>
<p>Let's try our help function. To be able to run the script, we have to add execution mode (+x) on it with the command <code>chmod</code>.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__usage-try.png" alt="" />
<figcaption>Help function</figcaption>
</figure>
<p>Pretty cool, isn't it ?</p>
<h3>Main function</h3>
<p>And now, let's create the main function. We don't care of <code>--no-stats</code> and <code>--quiet</code> parameters for now.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__main.png" alt="" />
<figcaption>Main function</figcaption>
</figure>
<p>So our main function starts by initializing both input and output directories with passed parameters; if left empty we take the current folder as input and create an <em>output</em> folder in the current one (thanks to the <code>mkdir</code> command). The <code>-p</code> parameter of the <code>mkdir</code> command forces the creation of all intermediate directories if they are missing.</p>
<p>Once the input and output are ready, there is a little trick to deal with files containing spaces. If I have a file <em>"soft kitty warm kitty.png"</em>, the loop will split this into 4 elements which will obviously lead to errors.
To avoid that, we can change the Internal File Separator (which is a space character by default) to set an end-of-line character. We will restore the original IFS at the end of the loop.</p>
<p>The image files are retrieved with the <code>find</code> command, which accepts a regular expression as parameter. If the output directory is a subdirectory of input directory (which is the case if we don't specify any of both) and if the output directory is not empty, we don't want to process images from here so we remove filepath which contains the output directory path. We do this with the <code>grep -v $OUTPUT</code> command.</p>
<p>And then, we loop through the files and call an <code>optimize_image</code> function with two parameters: the input and output filename for the image.</p>
<p>Now, we have to create this <code>optimize_image()</code> method but it's going to be fairly easy since we already have seen the command to optimize images before.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__optimize-image.png" alt="" />
<figcaption>Image optimization function</figcaption>
</figure>
<h3>Output informations</h3>
<p>Let's add some useful output to see progress and the final stats. What about something like this:</p>
<pre><code>file1 ...................... [ DONE ]
file2 ...................... [ DONE ]
file_with_a_long_name ...... [ DONE ]
...</code></pre>
<p>Would be neat, wouldn't it? To do this, we first need to find the longest filename by doing a fast loop on the files.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__get-max-file-length.png" alt="" />
<figcaption>Function to retrieve the longest filename</figcaption>
</figure>
<p>Then before our main loop, we:</p>
<ol>
<li>retrieve this length of the longest filename</li>
<li>create a very long string of dots (<em>"."</em>)</li>
<li>set a max line length equals to the length of the longest filename + the length of our " [ DONE ]" string (9 characters) + a small number (5 here) to have some space between the longest name and the " [ DONE ]" string.</li>
</ol>
<p>>Finally, in the main loop we display the filename then the "." symbols and the the " [ DONE ]" string. </p>
<figure class="figure">
<img src="/images/optimizing-with-bash__output.png" alt="" />
<figcaption>Script handling the output</figcaption>
</figure>
<p>Let's try it:</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__output-console.png" alt="" />
<figcaption>Testing the output</figcaption>
</figure>
<h3>Final stats</h3>
<p>For the final stats we are going to display the amount of space saved. The <code>optimize_image()</code> method will increase a <code>total_input_size</code> with the filesize of the image to optimize, and a <code>total_output_size</code> with the filesize of the output image. At the end of the loop, we will use this two counters to display the stats.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__optimize-image-with-stats.png" alt="" />
<figcaption>Adding stats output in optimize_image()</figcaption>
</figure>
<p>To display human readable numbers, we can use a <code>human_readable_filesize()</code> method, retrieve from <a href="http://unix.stackexchange.com/questions/44040/a-standard-tool-to-convert-a-byte-count-into-human-kib-mib-etc-like-du-ls1">StackExchange</a>.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__display-stats.png" alt="" />
<figcaption>Display of stats</figcaption>
</figure>
<p>We are almost done. We just have to display progress output if the quiet mode is on.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__quiet-mode.png" alt="" />
<figcaption>Quiet mode</figcaption>
</figure>
<h3>Final result</h3>
<p>Below lies the final script (editor's note: I have no syntax highlighter for Bash script, sorry for the ugly output guys). Or you can get the script directly from <a href="https://gist.github.com/lgiraudel/6065155">this gist</a>.</p>
<pre><code class="language-javascript">#!/bin/bash

PROGNAME=${0##*/}
INPUT=''
QUIET='0'
NOSTATS='0'
max_input_size=0
max_output_size=0

usage()
{
	cat &lt;&lt;EO
Usage: $PROGNAME [options]

Script to optimize JPG and PNG images in a directory.

Options:
EO
cat &lt;&lt;EO | column -s\& -t
	-h, --help  	   & shows this help
	-q, --quiet 	   & disables output
	-i, --input [dir]  & specify input directory (current directory by default)
	-o, --output [dir] & specify output directory ("output" by default)
	-ns, --no-stats    & no stats at the end
EO
}

# $1: input image
# $2: output image 
optimize_image()
{
	input_file_size=$(stat -c%s "$1")
	max_input_size=$(expr $max_input_size + $input_file_size)

	if [ "${1##*.}" = "png" ]; then
		optipng -o1 -clobber -quiet $1 -out $2
		pngcrush -q -rem alla -reduce $1 $2 >/dev/null
	fi
	if [ "${1##*.}" = "jpg" -o "${1##*.}" = "jpeg" ]; then
		jpegtran -copy none -progressive $1 > $2
	fi

	output_file_size=$(stat -c%s "$2")
	max_output_size=$(expr $max_output_size + $output_file_size)
}

get_max_file_length()
{
	local maxlength=0

	IMAGES=$(find $INPUT -regextype posix-extended -regex '.*\.(jpg|jpeg|png)' | grep -v $OUTPUT)

	for CURRENT_IMAGE in $IMAGES; do
		filename=$(basename "$CURRENT_IMAGE")
		if [[ ${#filename} -gt $maxlength ]]; then
			maxlength=${#filename}
		fi
	done

	echo "$maxlength"	
}

main()
{
	# If $INPUT is empty, then we use current directory
	if ["$INPUT" == ""]; then
		INPUT=$(pwd)
	fi

	# If $OUTPUT is empty, then we use the directory "output" in the current directory
	if ["$OUTPUT" == ""]; then
		OUTPUT=$(pwd)/output
	fi

	# We create the output directory
	mkdir -p $OUTPUT

	# To avoid some troubles with filename with spaces, we store the current IFS (Internal File Separator)...
	SAVEIFS=$IFS
	# ...and we set a new one
	IFS=$(echo -en "\n\b")

	max_filelength=`get_max_file_length`
	pad=$(printf '%0.1s' "."{1..600})
	sDone=' [ DONE ]'
	linelength=$(expr $max_filelength + ${#sDone} + 5)

	# Search of all jpg/jpeg/png in $INPUT
	# We remove images from $OUTPUT if $OUTPUT is a subdirectory of $INPUT
	IMAGES=$(find $INPUT -regextype posix-extended -regex '.*\.(jpg|jpeg|png)' | grep -v $OUTPUT)

	if [ "$QUIET" == "0" ]; then
		echo --- Optimizing $INPUT ---
		echo
	fi
	for CURRENT_IMAGE in $IMAGES; do
		filename=$(basename $CURRENT_IMAGE)
		if [ "$QUIET" == "0" ]; then
		    printf '%s ' "$filename"
		    printf '%*.*s' 0 $((linelength - ${#filename} - ${#sDone} )) "$pad"
		fi

		optimize_image $CURRENT_IMAGE $OUTPUT/$filename

		if [ "$QUIET" == "0" ]; then
		    printf '%s\n' "$sDone"
		fi
	done

	# we restore the saved IFS
	IFS=$SAVEIFS

	if [ "$NOSTATS" == "0" -a "$QUIET" == "0" ]; then
		echo
		echo "Input: " $(human_readable_filesize $max_input_size)
		echo "Output: " $(human_readable_filesize $max_output_size)
		space_saved=$(expr $max_input_size - $max_output_size)
		echo "Space save: " $(human_readable_filesize $space_saved)
	fi
}

human_readable_filesize()
{
	echo -n $1 | awk 'function human(x) {
	     s=" b  Kb Mb Gb Tb"
	     while (x>=1024 && length(s)>1) 
	           {x/=1024; s=substr(s,4)}
	     s=substr(s,1,4)
	     xf=(s==" b ")?"%5d   ":"%.2f"
	     return sprintf( xf"%s", x, s)
	  }
	  {gsub(/^[0-9]+/, human($1)); print}'
}

SHORTOPTS="h,i:,o:,q,s"
LONGOPTS="help,input:,output:,quiet,no-stats"
ARGS=$(getopt -s bash --options $SHORTOPTS --longoptions $LONGOPTS --name $PROGNAME -- "$@")

eval set -- "$ARGS"
while true; do
	case $1 in
		-h|--help)
			usage
			exit 0
			;;
		-i|--input)
			shift
			INPUT=$1
			;;
		-o|--output)
			shift
			OUTPUT=$1
			;;
		-q|--quiet)
			QUIET='1'
			;;
		-s|--no-stats)
			NOSTATS='1'
			;;
		--)
			shift
			break
			;;
		*)
			shift
			break
			;;
	esac
	shift
done

main</code></pre>
</section>
<section id="what-now">
<h2>What now ? <a href="#what-now">#</a></h2>
<p>This is just a sample. Now you can improve it to add GIF support, use other tools to optimize JPG and PNG in the <code>optimize_image</code> method (by the way, I highly recommand you to read <a href="http://www.phpied.com/big-list-image-optimization-tools">this great article</a> by Stoyan Stefanov), add a progress bar, try to add some lossy optimizations for JPG, add an auto-upload function to upload to your FTP, use a configuration file to tweak the optimization tools, etc.</p>
</section>