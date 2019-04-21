import re
import time
import random
import pymysql
import requests
from bs4 import BeautifulSoup
from fontTools.ttLib import TTFont
import mongodb
import mysqldb

head = """
Accept:text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8
Accept-Encoding:gzip, deflate, br
Accept-Language:zh-CN,zh;q=0.8
Cache-Control:max-age=0
Connection:keep-alive
Host:maoyan.com
Upgrade-Insecure-Requests:1
Content-Type:application/x-www-form-urlencoded; charset=UTF-8
User-Agent:Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/59.0.3071.86 Safari/537.36
"""


def str_to_dict(header):
    """
    构造请求头,可以在不同函数里构造不同的请求头
    """
    header_dict = {}
    header = header.split('\n')
    for h in header:
        h = h.strip()
        if h:
            k, v = h.split(':', 1)
            header_dict[k] = v.strip()
    return header_dict


def get_url():
    """
    获取电影详情页链接
    """
    for i in range(150, 300, 30):

        # 随机一个时间间隔，random（） 返回0-1 的数,以免IP地址被封
        time.sleep(random.random() * 4)
        url = 'http://maoyan.com/films?showType=3&yearId=13&sortId=3&offset=' + str(i)
        host = """Referer:http://maoyan.com/films?showType=3&yearId=13&sortId=3&offset=0
        """
        header = head + host
        headers = str_to_dict(header)
        response = requests.get(url=url, headers=headers)


        # soup = BeautifulSoup(html, 'html.parser')
        data_1 = soup.find_all('div', {'class': 'channel-detail movie-item-title'})
        data_2 = soup.find_all('div', {'class': 'channel-detail channel-detail-orange'})
        num = 0
        for item in data_1:
            num += 1
            time.sleep(10)
            url_1 = item.select('a')[0]['href']
            if data_2[num - 1].get_text() != '暂无评分':
                url = 'http://maoyan.com' + url_1
                for message in get_message(url):
                    # print(message)
                    # 向mysql 写数据
                    # to_mysql(message)
                    # 向mongo 写数据
                    to_mymongo(message)
                print(url)
                print('---------------^^^Film_Message^^^-----------------')
            else:
                print('The Work Is Done')
                break


def get_message(url):
    """
    获取电影详情页里的信息
    """
    # time.sleep(10)
    time.sleep(random.random() * 4)
    data = {}
    host = """refer: http://maoyan.com/news
    """
    header = head + host
    headers = str_to_dict(header)
    response = requests.get(url=url, headers=headers)
    u = response.text
    # 破解猫眼文字反爬
    (maoyan_num_list, utf8last) = get_numbers(u)
    # 获取电影信息
    soup = BeautifulSoup(u, "html.parser")
    mw = soup.find_all('span', {'class': 'stonefont'})
    score = soup.find_all('span', {'class': 'score-num'})
    unit = soup.find_all('span', {'class': 'unit'})
    ell = soup.find_all('li', {'class': 'ellipsis'})
    name = soup.find_all('h3', {'class': 'name'})

    user = soup.find_all('span', {'class': 'name'})
    time_comment = soup.find_all('div', {'class': 'time'})
    score_start = soup.find_all('ul', {'class': 'score-star clearfix'})
    comment_approve = soup.find_all('span', {'class': 'num'})
    comment_content = soup.find_all('div', {'class': 'comment-content'})
    # print(time_comment[0].find('span').get_text())

    # 返回电影信息
    # _id +=1

    data["name"] = name[0].get_text()
    data["type"] = ell[0].get_text()
    data["country"] = ell[1].get_text().split('/')[0].strip().replace('\n', '')
    data["length"] = ell[1].get_text().split('/')[1].strip().replace('\n', '')
    data["released"] = ell[2].get_text()[:10]

    # 因为会出现没有票房的电影,所以这里需要判断
    if unit:
        bom = ['分', score[0].get_text().replace('.', '').replace('万', ''), unit[0].get_text()]
        for i in range(len(mw)):
            moviewish = mw[i].get_text().encode('utf-8')
            moviewish = str(moviewish, encoding='utf-8')
            # 通过比对获取反爬文字信息
            for j in range(len(utf8last)):
                moviewish = moviewish.replace(utf8last[j], maoyan_num_list[j])
            if i == 0:
                data["score"] = moviewish + bom[i]
            elif i == 1:
                if '万' in moviewish:
                    data["people"] = int(float(moviewish.replace('万', '')) * 10000)
                else:
                    data["people"] = int(float(moviewish))
            else:
                if '万' == bom[i]:
                    data["box_office"] = int(float(moviewish) * 10000)
                else:
                    data["box_office"] = int(float(moviewish) * 100000000)
    else:
        bom = ['分', score[0].get_text().replace('.', '').replace('万', ''), 0]
        for i in range(len(mw)):
            moviewish = mw[i].get_text().encode('utf-8')
            moviewish = str(moviewish, encoding='utf-8')
            for j in range(len(utf8last)):
                moviewish = moviewish.replace(utf8last[j], maoyan_num_list[j])
            if i == 0:
                data["score"] = moviewish + bom[i]
            else:
                if '万' in moviewish:
                    data["people"] = int(float(moviewish.replace('万', '')) * 10000)
                else:
                    data["people"] = int(float(moviewish))
        data["box_office"] = bom[2]

    # 在最后添加用户评论
    # data["user"] = []
    # data["time_comment"] = []
    # data["score_start"] = []
    # data["comment_approve"] = []
    # data["comment_content"] = []
    #
    # numbre = len(user)
    # for i in range(numbre):
    #     data["user"].append(user[i].get_text())
    #     data["time_comment"].append(time_comment[i].find('span').get_text())
    #     data["score_start"].append(score_start[i].get('data-score'))
    #     data["comment_approve"].append(comment_approve[i].get_text())
    #     data["comment_content"].append(comment_content[i].get_text())

    yield data


def to_mysql(data):
    """
    信息写入mysql
    """
    # 创建猫眼数据库,输入你mysql 数据库的用户名，和密码,创建maoyao 数据库
    maoyandb = mysqldb(user='root', password='111111');
    table1 = 'films'
    # table2 = 'users'
    keys = ', '.join(data.keys())
    # keys = 'name,type,country,length,released,score,people,box office'
    # values1='%s'
    values = ', '.join(['%s'] * len(data))
    db = pymysql.connect(host='localhost', user='root', password='111111', port=3306, db='maoyan')

    cursor = db.cursor()
    sql = 'INSERT INTO {table}({keys}) VALUES ({values})'.format(table=table1, keys=keys, values=values)
    # sql1 = 'INSERT INTO {table} VALUES ({values})'.format(table=table1, keys=keys, values=values)
    try:
        if cursor.execute(sql, tuple(data.values())):
            print("Successful")
            db.commit()
    except:
        print('Failed')
        db.rollback()
    db.close()


def to_mymongo(data):
    # 已经连接到MongoDB数据库了
    # dbname 数据库名字，collectionName 电影表
    dbname = 'maoyan'
    collectionName = 'testmaoyan'
    db = mongodb.mongoDB(dbname, collectionName)

    # 使用默认_id
    item = db.process_item(data, True);
    print(item)


def get_numbers(u):
    """
    对猫眼的文字反爬进行破解
    """
    cmp = re.compile(",\n           url\('(//.*.woff)'\) format\('woff'\)")
    rst = cmp.findall(u)
    ttf = requests.get("http:" + rst[0], stream=True)
    with open("maoyan.woff", "wb") as pdf:
        for chunk in ttf.iter_content(chunk_size=1024):
            if chunk:
                pdf.write(chunk)
    base_font = TTFont('base.woff')
    maoyanFont = TTFont('maoyan.woff')
    maoyan_unicode_list = maoyanFont['cmap'].tables[0].ttFont.getGlyphOrder()
    maoyan_num_list = []
    base_num_list = ['.', '3', '0', '8', '9', '4', '1', '5', '2', '7', '6']
    # base_unicode_list = ['x', 'uniF561', 'uniE6E1', 'uniF125', 'uniF83F', 'uniE9E2', 'uniEEA6', 'uniEEC2', 'uniED38', 'uniE538', 'uniF8E7']
    base_unicode_list = ['x', 'uniF849', 'uniE581', 'uniF178', 'uniF533',
                         'uniEC0F', 'uniED67', 'uniEF38', 'uniE223', 'uniF7C6', 'uniF89D']
    for i in range(1, 12):
        maoyan_glyph = maoyanFont['glyf'][maoyan_unicode_list[i]]
        for j in range(11):
            base_glyph = base_font['glyf'][base_unicode_list[j]]
            if maoyan_glyph == base_glyph:
                maoyan_num_list.append(base_num_list[j])
                break
    maoyan_unicode_list[1] = 'uni0078'
    utf8List = [eval(r"'\u" + uni[3:] + "'").encode("utf-8") for uni in maoyan_unicode_list[1:]]
    utf8last = []
    for i in range(len(utf8List)):
        utf8List[i] = str(utf8List[i], encoding='utf-8')
        utf8last.append(utf8List[i])
    return (maoyan_num_list, utf8last)


def main():
    time.sleep(random.random() * 3)
    get_url()


if __name__ == '__main__':
    main()
