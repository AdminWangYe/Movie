#-------------------------------------------------------------------------------
# Name:         fontchange
# Description:  
#
#
# Author:       Admin
# Date:         2018/11/15
#-------------------------------------------------------------------------------

from fontTools.ttLib import TTFont



# 主函数运行开始的地方
if __name__ == '__main__':


    # font = TTFont('base.woff')
    # font.saveXML('base.xml')
    font = TTFont('maoyan.woff')
    font.saveXML('maoyan.xml')