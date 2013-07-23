---
title: Optimizing images with Bash script
preview: true
comments: false
layout: post
---
<section>
<p>Let's try a not-so-easy exercise: write a script to optimize a directory of images. Yup, I know there are a lot of web services offering this kind of service but:</p>
<ul>
<li>it's not quite easy to use it in an industrial process,</li>
<li>it's always interesting to learn how those services work.</li>
</ul>
<p>But first, a simple warning: don't expect big optimizations. To have the best results, you have to decrease the image quality but it's better to do this manually than automatically. We are going to script simple operations that remove metadata and other losslessly informations.</p>
<p>I'm working on Linux environment so this script will be a Bash script but I will start to explain how to make it work in a Windows environment.</p>
</section>
<section id="linux">
<h2>Use Linux flavour in Windows <a href='#linux'>#</a></h2>
<p>To be able to run Linux scripts in windows, there is two methods:</p>
<ul>
<li>use a Virtual Machine with a Linux distribution on it,<li>
<li>use a Linux simulator.</li>
</ul>
<p><a href="http://www.cygwin.com/">Cygwin</a> is a Linux simulator. Go to the <a href="http://cygwin.com/install.html">download section</a>, grab the setup.exe file and execute it to launch the installer. A step of the installation process will ask you which packages to install.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__cygwin.png" alt="" />
<figcaption>Cygwin</figcaption>
</figure>
<p>To add a package, click on the "Skip" label to switch it to a package version. Search and add the following packages:<p>
<ul>
<li>optipng</li>
<li>pngcrush</li>
<li>jpeg</li>
<li>util-linux</li>
</ul>
<p>Once Cygwin is installed, just open a Cygwin terminal. Let's create a workspace to host our optimization script: we create a "workspace" directory in the current user home:</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__workspace.png" alt="" />
<figcaption>Workspace creation</figcaption>
</figure>
<p>By default, Cygwin is installed in C:/cygwin/ so our new directory is at C:/cygwin/home/[username]/workspace. Let's create a "images" directory and fill it with some random images from the wild wild web. For this exercise, we are going to take cat pictures because, you know, everybody love cats.</p>
</section>
<section id="optimization">
<h2>Optimization of an image with command line <a href="#optimization">#</a></h2>
<p>For each file, we are going to run optipng and pngcrush for PNG files and jpegtran for JPG files. A first try with optipng:</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__optipng.png" alt="" />
<figcaption>PNG optimization with optipng</figcaption>
</figure>
<p class="note">Note: the -o7 parameter force optipng to use the slowest mode. The fastest is -o0.</p>
<p>And now pngcrush:</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__pngcrush.png" alt="" />
<figcaption>PNG optimization with pngcrush</figcaption>
</figure>
<p>And now a JPEG optimization with jpegtran:</p>
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
<li>a parameter <code>-i</code> or <code>--input</code> so specify an input directory</li>
<li>a parameter <code>-o</code> or <code>--output</code> to specify an output directory</li>
<li>a parameter <code>-q</code> or <code>--quiet</code> to disable verbose output</li>
<li>a parameter <code>-ns</code> or <code>--no-stats</code> to disable the display of some stats at the end of the run</li>
<li>a parameter <code>-h</code> or <code>--help</code> to display some help</li>
</ul>
<p>There is a common pattern to parse script options, based on the <code>getopt</code> command. First, create to variables to store the short and long version of each parameter. A parameter which requires a specific value (for example our input and output directories) must end with ":".</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__options.png" alt="" />
<figcaption>Script options</figcaption>
</figure>
<p>Then we are going to use the <code>getopt</code> command to parse the parameters passed to script and use a loop to call functions or define variables to store values. Fo this, we will also need to know the script name.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__options-loop.png" alt="" />
<figcaption>Options loop</figcaption>
</figure>
<h3>Help function</h3>
<p>Now, we have to create two functions: </p>
<ul>
<li>the usage function, called in the parameters loop if there is a <code>-h</code> or <code>--help</code> parameter,</li>
<li>a main function which will do the optimization of the images.</li>
</ul>
<p>To be called, the functions must be declared before the parameters loop.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__usage.png" alt="" />
<figcaption>Help function</figcaption>
</figure>
<p>Let's try our help function. To be able to run the script, we have to add execution mode (+x) on it with the command chmod.</p>
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
<p>So our main function starts by an initialization of input and output directories if with default values (the current dir and an <code>output</code> dir in the current directory). Then we create the output directory with the <code>mkdir</code> command. The <code>-p</code> parameter of the mkdir command forces to create all the intermediate directories if they are missing.</p>
<p>Once the input and output are ready, there is a little trick to deal with files containing spaces. If I have a file "soft kitty warm kitty.png", the loop will split this into 4 elements which will introduces errors.
To avoid that, we can change the Internal File Separator (which is a space character by default) to set an end-of-line character. We will restore the original IFS at the end of the loop.</p>
<p>The image files are retrieved with the "find" command, which accepts a regexp as parameter. If the output directory is a subdirectory of input directory (which is our default behavior if we don't specify any of both) and if the output directory is not empty, we don't want to process images from here so we remove filepath which contains the output directory path. We do this with the <code>grep -v $OUTPUT</code> command.</p>
<p>And then, we loop on the files and call an optimize_image function with two parameters: the input and output filename for the image.</p>
<p>Now, we have to create this <code>optimize_image()</code> method but it's gonna be easy, we already have seen the command to optimize images.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__optimize_image.png" alt="" />
<figcaption>Image optimization function</figcaption>
</figure>
<h3>Output informations</h3>
<p>Let's add some useful output to see progress and the final stats.</p>
<p>We are going to try to have an output like this:</p>
<pre><code>file1 ...................... [ DONE ]
file2 ...................... [ DONE ]
file_with_a_long_name ...... [ DONE ]
...</code></pre>
<p>To do this, we first need to find the longest filename by doing a fast loop on the files.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__get-max-file-length.png" alt="" />
<figcaption>Max file length function</figcaption>
</figure>
<p>Then, before our main loop, we retrieve this max file length, we create a very long string of "." characters and we set a max line length equal to the max file length + the length of our " [ DONE ]" string + a small number (5 here) to have some space between the file with the max lenght and the " [ DONE ]" string.</p>
<p>Finally, in the main loop we display the filename, then the "." symbols and the the " [ DONE ]" string. </p>
<figure class="figure">
<img src="/images/optimizing-with-bash__output.png" alt="" />
<figcaption>Output</figcaption>
</figure>
<p>Let's try it:</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__output-console.png" alt="" />
<figcaption>Output test</figcaption>
</figure>
<h3>Final stats</h3>
<p>For the final stats we are going to display the total of space save. The <code>optimize_image()</code> method will increase a <code>total_input_size</code> with the filesize of the image to optimize and a "total_output_size" with the filesize of the output image. At the end of the loop, we will use this two counters to display the stats.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__optimize-image-with-stats.png" alt="" />
<figcaption>Add stats in optimize_image()</figcaption>
</figure>
<p>To display human readable numbers, we can use a <code>human_readable_filesize()</code> method, retrieve from [StackExchange](http://unix.stackexchange.com/questions/44040/a-standard-tool-to-convert-a-byte-count-into-human-kib-mib-etc-like-du-ls1).</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__display_stats.png" alt="" />
<figcaption>Display of stats</figcaption>
</figure>
<p>We are almost done. We just have to display progress output if the quiet mode is on.</p>
<figure class="figure">
<img src="/images/optimizing-with-bash__quiet-mode.png" alt="" />
<figcaption>Quiet mode</figcaption>
</figure>
<h3>Final result</h3>
<p>The final script looks like this:</p>
<pre><code>#!/bin/bash

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
<p>This is just a sample, now you can enrich it to add GIF support, use other tools to optimize jpeg and png in the optimize_image method (you should read [this great article](http://www.phpied.com/big-list-image-optimization-tools) of Stoyan Stefanov), add a progress bar, try to add some lossy optimizations for jpeg, add an auto-upload function to upload to your FTP, use a configuration file to tweak the optimization tools, etc.</p>
</section>