from sklearn.neighbors import KNeighborsClassifier
from data import datasets

import numpy as np

class KNN_model():
    def __init__(self):
        self.datasets=datasets()
        self.movie_name = self.datasets.get_movie_name()
        self.movie_dict=self.datasets.get_movie_dict()
        self.movie_score = self.datasets.get_movie_score()
        self.OneHot=self.datasets.get_OneHot()

        self.knn = KNeighborsClassifier(n_neighbors=3)
        self.knn.fit(self.OneHot, range(0,len(self.OneHot)))

    def knn_predict(self, movie, neighbors=10, out_number=5):
        self.location_id = self.movie_dict[movie]
        self.movie_id = self.OneHot[self.location_id]
        self.neighbors = self.knn.kneighbors(np.reshape(self.movie_id,[-1,self.OneHot.shape[-1]]), neighbors, False)
        self.get_neoghbor_name = np.reshape(self.movie_name[self.neighbors],[-1,neighbors])
        self.get_neoghbor_score = np.reshape(self.movie_score[self.neighbors], [-1,neighbors])
        self.id = np.argsort(self.get_neoghbor_score)
        self.result = []
        for i in range(0, len(self.get_neoghbor_name)):
            rst = self.get_neoghbor_name[i][self.id[i]].tolist()
            rst.remove(movie)
            self.result.append(rst[0:out_number])
        return self.result


# iris_y_predict = knn.predict(iris_x_test)

# print(iris_y_predict)