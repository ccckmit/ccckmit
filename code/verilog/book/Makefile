# PANDOC = pandoc -s --mathml 
PANDOC = pandoc -s --webtex 
MD0 = $(patsubst %.md0,%.md,$(wildcard *.md0))
# MD0 = $(wildcard *.md0)
HTML = $(patsubst %.md,%.html,$(wildcard *.md)) $(patsubst %.md0,%.html,$(wildcard *.md0))
MD   = title.md preface.md license.md opencomputer.md hardware.md verilog.md verilog1.md verilog2.md combinatorial.md alu.md memory.md control.md mcu.md mcu0m.md mcu0bm.md mcu0mb.md mcu0s.md io.md mcu0io.md storage.md hierarchy.md cache.md cpu.md harvard.md pipeline.md cpu0m.md cpu0s.md speed.md mult.md fpu.md graphics.md parallel.md end.md appendix.md book.md reflink.md9
PARG = -c ../css/pmag.css -B header.htm -A footer.htm --toc --base-header-level=1 --toc-depth=2 
PEPUB = --toc --base-header-level=1 --toc-depth=2 --epub-metadata=metadata.xml --epub-stylesheet=../css/pmag.css 
EARG = --margin-top=16 --margin-bottom=16 --margin-left=20 --margin-right=20 \
--pretty-print --base-font-size=14 --font-size-mapping="10, 12, 14, 16, 20, 24, 28, 36" 
# 
# --embed-font-family --extra-css="../css/pmag.css" 
RM = rm -f

.PHONY: all

all: $(HTML) shtm epubipad epubA4 pdfipad pdfA4

epubA4: $(MD0)
	$(PANDOC) $(PEPUB) --epub-cover-image=../img/cover.jpg $(MD) -o ../book/A4.epub

pdfA4: epubA4
	ebook-convert ../book/A4.epub ../book/A4.pdf $(EARG) --paper-size=a4

epubipad: $(MD0)
	$(PANDOC) $(PEPUB) --epub-cover-image=../img/cover.jpg $(MD) -o ../book/ipad.epub

epub2ipad: epubipad
	ebook-convert ../book/ipad.epub ../book/ipad2.epub $(EARG) --output-profile=ipad3

pdfipad: epubipad
	ebook-convert ../book/ipad.epub ../book/ipad.pdf $(EARG) --output-profile=ipad3
	
shtm2pdf: shtm
	ebook-convert ../book/pmagIE.html ../book/pmag.pdf $(EARG) --output-profile=ipad3
	
html: $(MD0) $(HTML)

shtm: 
	$(PANDOC) $(MD) -o ../book/pmag.html $(PARG)

%.md: %.md0
	node md0.js $< $@

%.html: %.md
	$(PANDOC) $< reflink.md9 -o ../htm/$@ $(PARG)
	
clean: 
	${RM} ../htm/*.*
	${RM} ../book/*.*
	${RM} ../timg/*.*
	${RM} $(MD0)

    
#%.md0 : 
#	node md0.js $*.md0 $*.md   
# md0: $(MD0)  
# $?：代表已被更新的 dependencies 的值。也就是 dependencies 中，比 targets 還新的值。
# $@：代表 targets 的值。
# $<：代表第一個 dependencies 的值。
# $* : 代表 targets 所指定的檔案，但不包含副檔名。
