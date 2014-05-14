A Little Bit About
========

Spectrum:

Spectrum is mostly written in functional javascript, around 90+ percent, some aspects of the animation
and node manipulation could not be done in a 100% functional way. 

I chose functional style of written javascript, because the goals of stability, predictability are more easily achieved wiht this style, the code is more compartmentalized as most functions are simple return statements, which can then be moved around easier between modules if necessary as well as tested much easier. 

Most modules have a make function to initiate them, and many of them can also be equated to a function that just returns value. This modules can be appended to other modules through the naming conventions i have created such as 
"spectrum.animate.index_image". This means that index image is a component of animate which is a component of spectrum. Meaning that spectrum has access to it. This system allows me to compartmentalize certain aspects and functions of the plugin into nice neat little modules which only perform a singe action. This again makes easier testing, debugging and more convenient organization. 

Also any library can be required by any module. I have also created a library called morphism.js, which deals with some of the issues that one that come across when writing functional js, such as object references, or easier looping in the functional style. 

Spectrum servers as a mini framework of sorts, as all the files that need to be included, are defined in the spectrum.configuration.js, these files are then included by require.js and sorted by spectrum.sorter.js which appends modules to their parents, and includes libraries where they are wanted.

Creating small packages which can easily be included in existing applications or joined together with other small existing packages, may very well be the future of front end development, as it would cease relying on a single framework to provide functionality, and different components made by different people could be flexibly married together and applications could be built faster.
